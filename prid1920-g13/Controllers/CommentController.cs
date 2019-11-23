using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using prid_1819_g13.Models;
using Microsoft.AspNetCore.Authorization;

namespace prid_1819_g13.Controllers
{
    [Authorize]
    [Route("api/comments")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly Context _context;
        public CommentController(Context context){
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetAll()
        {
            return (await _context.Comments.ToListAsync()).ToDTO();
        }

    }
}