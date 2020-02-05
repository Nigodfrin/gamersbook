using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using PRID_Framework;
using System.Linq;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace prid_1819_g13.Controllers
{
    [Route("api/userNeo4J")]
    [ApiController]
    public class UserNeo4JController : ControllerBase
    {
        public GraphClient Client;
        public UserNeo4JController(){
            Console.WriteLine("Connecting to Neo4J");
            this.Client = new GraphClient(new Uri("http://localhost:7474/db/data/"), "neo4j", "123")
            {
                JsonContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            Client.ConnectAsync();
        }
        [HttpGet]
        public async Task<IEnumerable<UserNeo4J>> GetAll()
        {
            var users = await this.Client.Cypher.Match("(u:User)").Return(u => u.As<UserNeo4J>()).ResultsAsync;
            return users;
        }
    }
}