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
using Microsoft.AspNetCore.Identity;

namespace prid_1819_g13.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventGameController : ControllerBase
    {
        private readonly Context _context;
        public EventGameController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<EventDTO>>> GetEvents()
        {
            var events = _context.Events.Where(e => e.AccessType == AccessType.Public);
            if(events == null){
                return NotFound();
            }

            return events.EventsToDTO();
        }
        //         [HttpGet("{uuid}")]
        //         public async Task<ActionResult<EventsGame>> GetEvent(string uuid){
        //             await this.Client.ConnectAsync();

        //             var eg = await this.Client.Cypher
        //             .Match("(e:Event)")
        //             .Where((EventsGame e) => e.Id == uuid)
        //             .Return(e => e.As<EventsGame>())
        //             .ResultsAsync;

        //             return eg.ToList().FirstOrDefault();

        //         }
        //         [HttpPost("acceptInvit")]
        //         public async Task acceptInvit(NotificationNeo4J notif){
        //             var pseudo = User.Identity.Name;
        //             await this.Client.ConnectAsync();            
        //             await this.Client.Cypher
        //             .Match("(e:Event {uuid: {param}.uuidEvent})")
        //             .Match("(n:Notification {uuid: {param}.uuid})<-[:Has]-(u:User)")
        //             .Where((UserNeo4J u) => u.Pseudo == pseudo)
        //             .WithParam("param",notif)
        //             .Create("(u)-[:Participate_In]->(e)")
        //             .DetachDelete("n")
        //             .ExecuteWithoutResultsAsync();
        //         }
        //         [HttpDelete("refuseInvit/{uuid}")]
        //         public async Task refuseEvent(string uuid){
        //             await this.Client.ConnectAsync();            
        //             await this.Client.Cypher
        //             .Match("(n:Notification)")
        //             .Where((NotificationNeo4J n) => n.Uuid == uuid )
        //             .DetachDelete("n")
        //             .ExecuteWithoutResultsAsync();
        //         }

        [HttpPost]
        public async Task<ActionResult<Event>> CreateEvent(Event eventData)
        { 
            _context.Events.Add(eventData);
            await _context.SaveChangesAsync();
            var e = _context.Events.FirstOrDefault(e => e.Name == eventData.Name && e.CreatedByUserId == eventData.CreatedByUserId);
            if (e == null)
            {
                return NotFound();
            }
            return e;
        }
        [HttpPost("participationResponse")]
        public async Task<ActionResult<Event>> ParticipationResponse(Event eventData)
        {
            _context.Events.Add(eventData);
            await _context.SaveChangesAsync();
            var e = _context.Events.FirstOrDefault(e => e.Name == eventData.Name && e.CreatedByUserId == eventData.CreatedByUserId);
            if (e == null)
            {
                return NotFound();
            }
            return e;
        }
    }
}