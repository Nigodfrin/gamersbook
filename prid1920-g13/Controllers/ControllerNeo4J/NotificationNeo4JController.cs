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
    [Route("api/notification")]
    [ApiController]
    public class NotificationNeo4JController : ControllerBase
    {
        private readonly Context _context;
        public NotificationNeo4JController(Context context)
        {
            _context = context;
        }

        [HttpPost] 
        public async Task<Notification> SendNotification(Notification notif)
        {
            _context.Notifications.Add(notif);
            var res = await _context.SaveChangesAsync();
            return notif;
        }

    }
}