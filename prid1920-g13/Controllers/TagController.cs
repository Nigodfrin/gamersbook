using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using prid_1819_g13.Models;
using Microsoft.AspNetCore.Authorization;

namespace prid_1819_g13.Controllers
{
    [Authorize]
    [Route("api/tags")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly Context _context;
        public TagController(Context context){
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDTO>>> GetAll()
        {
            return (await _context.Tags.ToListAsync()).ToDTO();
        }

    }
}