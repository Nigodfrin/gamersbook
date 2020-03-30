using Microsoft.AspNetCore.Mvc;
using System;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;


namespace prid_1819_g13.Controllers
{
    [Route("api/message")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        public GraphClient Client = new GraphClient(new Uri("http://localhost:7474/db/data/"), "neo4j", "123")
        {
            JsonContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        public MessageController()
        {
        }

        [HttpPost("/send")]
        public async Task<IActionResult> sendMessage(Message message){
            var mes = new Message{SenderPseudo = message.SenderPseudo, MessageText = message.MessageText,ReceiverPseudo = message.ReceiverPseudo};
            await this.Client.ConnectAsync();
             this.Client.Cypher
             .Match("(me:User)-[:PartOf]->(d:Discussion)<-[:PartOf]-(other:User)")
             .Where((UserNeo4J me) => me.Pseudo == message.SenderPseudo)
             .AndWhere((UserNeo4J other) => other.Pseudo == message.ReceiverPseudo)
             .Create("(me)-[:send]->(m:Message {message})<-[:In]-(d)")
             .WithParam("message",mes)
             .ExecuteWithoutResultsAsync()
             .Wait();
             return NoContent();
        }

    }
}