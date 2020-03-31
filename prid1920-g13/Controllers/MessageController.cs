using Microsoft.AspNetCore.Mvc;
using System;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
using prid_1819_g13.Models;

namespace prid_1819_g13.Controllers
{
    [Route("api/message")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly Context _context;
        public MessageController(Context context)
        {
            _context = context;
        }

        // [HttpPost("/send")]
        // public async Task<IActionResult> sendMessage(Message message){
           
        // }
        // [HttpGet]
        // public async Task<ActionResult<List<Message>>> GetMessages(){
            
            
        // }

    }
}