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
using Microsoft.EntityFrameworkCore;

namespace prid_1819_g13.Controllers
{
    [Route("api/gameNeo4J")]
    [ApiController]
    public class GameNeo4JController : ControllerBase
    {
        private readonly Context _context;
        public GameNeo4JController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetAllGames()
        {
            var list = await _context.Games.ToListAsync();
            return list;
        }
    }
}