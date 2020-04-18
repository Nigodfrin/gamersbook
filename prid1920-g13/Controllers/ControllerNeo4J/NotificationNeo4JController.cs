using Microsoft.AspNetCore.Mvc;
using System;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace prid_1819_g13.Controllers
{
    [Route("api/notifsNeo4J")]
    [ApiController]
    public class NotificationNeo4JController : ControllerBase
    {
        public GraphClient Client = new GraphClient(new Uri("http://localhost:7474/db/data/"), "neo4j", "123")
        {
            JsonContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        public NotificationNeo4JController()
        {
        }

        [HttpPost] 
        public async Task SendNotification(InvitNotif invit){
            
            await this.Client.ConnectAsync();
            var pseudos = invit.Users.Select(u => u.Pseudo).ToArray();
            this.Client.Cypher
            .Match("(u:User)")
            .Where("u.pseudo in {pseudos}")
            .WithParam("pseudos",pseudos)
            .Create("(n:Notification {notif})<-[:Has]-(u)")
            .WithParam("notif",invit.Notif)
            .ExecuteWithoutResultsAsync().Wait();

        }

    }
}