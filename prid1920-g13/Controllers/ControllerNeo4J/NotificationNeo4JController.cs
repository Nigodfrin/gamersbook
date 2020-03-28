using Microsoft.AspNetCore.Mvc;
using System;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;


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

    }
}