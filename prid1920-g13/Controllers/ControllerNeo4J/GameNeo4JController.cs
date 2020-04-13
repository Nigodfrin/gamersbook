using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using PRID_Framework;
using System.Linq;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
using prid_1819_g13.Models;

namespace prid_1819_g13.Controllers
{
    [Route("api/gameNeo4J")]
    [ApiController]
    public class GameNeo4JController : ControllerBase
    {
        public GraphClient Client = new GraphClient(new Uri("http://localhost:7474/db/data/"), "neo4j", "123")
        {
            JsonContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        public GameNeo4JController()
        {
        }
        // [HttpPost("{game}")]
        // public async Task addGame(GameDTO game)
        // {

        // }
    }
}