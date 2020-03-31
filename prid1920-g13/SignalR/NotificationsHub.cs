using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;


namespace prid_1819_g13
{
    public class NotificationsHub : Hub
    {
        public async Task SendMessage(string user,string from, string msg)
        {
            await Clients.Group(user).SendAsync("ReceiveMessage", from, msg);
        }
        public async Task JoinRoom(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }

        public async Task LeaveRoom(string roomName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
        }
    }
}