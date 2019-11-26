using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_1819_g13.Models;

namespace prid_1819_g13.Controllers
{
    [Route("api/posts")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly Context _context;

        public PostsController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> GetAll()
        {
            return (await _context.Posts.Where(p => p.Title != null).ToListAsync()).PostQuestToDTO();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PostQuestionDTO>> GetPostById(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound();
            return post.PostQuestToDTO();
        }
    }
}