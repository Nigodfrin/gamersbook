using Microsoft.AspNetCore.Mvc;
using System;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13.Controllers
{
    [Route("api/notifsNeo4J")]
    [ApiController]
    public class NotificationNeo4JController : ControllerBase
    {
        private readonly Context _context;
        public NotificationNeo4JController(Context context)
        {
            _context = context;
        }

        [HttpPost] 
        public async Task<Notification> SendNotification(int id,int idReceiver,int eventId)
        {
            var notif = new Notification(){
                SenderId = id,
                ReceiverId = idReceiver,
                NotificationType = NotificationTypes.Event,
                EventId = eventId,
                See = false
            };
            _context.Notifications.Add(notif);
            var res = await _context.SaveChangesAsync();
            return notif;
        }

    }
}