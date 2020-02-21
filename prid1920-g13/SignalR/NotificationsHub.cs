using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;


namespace prid_1819_g13
{
    public class NotificationsHub : Hub
    {
        public async Task SendMessage(string use, string msg)
        {
            await Clients.All.SendAsync("ReceiveMessage", use+" : " + msg);
        }
    }
}