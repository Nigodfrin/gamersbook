using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using Neo4jClient;
using Neo4jClient.Cypher;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
using prid_1819_g13.Models;

namespace prid_1819_g13.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventGameController : ControllerBase
    {
        public GraphClient Client = new GraphClient(new Uri("http://localhost:7474/db/data/"), "neo4j", "123")
        {
            JsonContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        public EventGameController()
        {
        }

        [HttpGet]
        public async Task<ActionResult<List<EventData>>> GetEvent()
        {
            await this.Client.ConnectAsync();
            var eg = await 
            this.Client.Cypher
            .Match("(u:User)-[:Participate_In]->(e:Event)-[:About]->(g:Game)")
            .Return((e,g,u) => new EventData() {
                EventGame = e.As<EventsGame>(),
                Participants = u.CollectAs<UserNeo4J>(),
                Game= g.As<GameNeo4J>()
            }).ResultsAsync;
            return eg.ToList();
        }
    }
}