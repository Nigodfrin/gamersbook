using Microsoft.AspNetCore.SignalR;
using prid_1819_g13.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;


namespace prid_1819_g13
{
    public class NotificationsHub : Hub
    {
        private static List<string> CONNECTED_USERS = new List<string>();

        public override async Task OnConnectedAsync(){
            await Clients.All.SendAsync("test","coucou je test");
        }
        public async Task SendMessage(string user,string from, MessageDTO msg)
        {
            await Clients.Group(user).SendAsync("ReceiveMessage", from, msg);
        }
        public async Task JoinRoom(string roomName)
        {
            if(!isInList(roomName)){
                CONNECTED_USERS.Add(roomName);
            }
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.All.SendAsync("refreshFriends",CONNECTED_USERS);
        }
        public async Task refreshNotif(string name){
            
        }

        public async Task LeaveRoom(string roomName)
        {
            CONNECTED_USERS.Remove(roomName);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
            await Clients.All.SendAsync("refreshFriends",CONNECTED_USERS);
        }
        private bool isInList(string pseudo){
            return CONNECTED_USERS.Any(u => u == pseudo);
        }
    }
}