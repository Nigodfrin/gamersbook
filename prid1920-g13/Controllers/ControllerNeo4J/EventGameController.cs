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
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EventsGame>> GetEvent(string uuid){
            await this.Client.ConnectAsync();

            var eg = await this.Client.Cypher
            .Match("(e:Event)")
            .Where((EventsGame e) => e.Id == uuid)
            .Return(e => e.As<EventsGame>())
            .ResultsAsync;

            return eg.ToList().FirstOrDefault();

        }
        [HttpPost("acceptInvit")]
        public async Task acceptInvit(NotificationNeo4J notif){
            var pseudo = User.Identity.Name;
            await this.Client.ConnectAsync();            
            await this.Client.Cypher
            .Match("(e:Event {uuid: {param}.uuidEvent})")
            .Match("(n:Notification {uuid: {param}.uuid})<-[:Has]-(u:User)")
            .Where((UserNeo4J u) => u.Pseudo == pseudo)
            .WithParam("param",notif)
            .Create("(u)-[:Participate_In]->(e)")
            .DetachDelete("n")
            .ExecuteWithoutResultsAsync();
        }
        [HttpDelete("refuseInvit/{uuid}")]
        public async Task refuseEvent(string uuid){
            await this.Client.ConnectAsync();            
            await this.Client.Cypher
            .Match("(n:Notification)")
            .Where((NotificationNeo4J n) => n.Uuid == uuid )
            .DetachDelete("n")
            .ExecuteWithoutResultsAsync();
        }

        [HttpPost]
        public async Task<EventsGame> CreateEvent(EventData eventData){
            Guid g = Guid.NewGuid();
            var connectedPseudo = User.Identity.Name;
            var pseudo = eventData.Participants.ToArray()[0].Pseudo;
            await this.Client.ConnectAsync();
            var gameName = eventData.Game.Name;
            var eventgame = eventData.EventGame;
            eventgame.Id = g.ToString();
            await this.Client.Cypher
            .Create("(e:Event {eventdata})")
            .WithParam("eventdata",eventgame)
            .With("e")
            .Match("(g:Game),(u2:User)")
            .Where((GameNeo4J g) => g.Name == gameName)
            .AndWhere("u2.pseudo = {pseudo}")
            .WithParam("pseudo",pseudo)
            .Merge("(g)<-[:About]-(e)")
            .Merge("(u2)-[:Participate_In]->(e)")
            .ExecuteWithoutResultsAsync();

            return eventgame;
        }
    }
}