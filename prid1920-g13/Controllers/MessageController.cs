using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
using prid_1819_g13.Models;
using Microsoft.EntityFrameworkCore;
using PRID_Framework;

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

        [HttpPost]
        public async Task<IActionResult> sendMessage(Message message){
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}