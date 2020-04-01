using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using prid_1819_g13.Models;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace prid_1819_g13.Controllers
{
    [Authorize]
    [Route("api/discussion")]
    [ApiController]
    public class DiscussionController : ControllerBase
    {
        private readonly Context _context;
        public DiscussionController(Context context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<List<DiscussionDTO>>> GetDiscussions(int id){
            var discussions = await  _context.Discussions.Where(d => d.UserDiscussions.Any(u => u.UserId == id)).ToListAsync();
            return discussions.DiscussionToDTO();
        }

        [HttpPost]
        public async Task<DiscussionDTO> AddDiscussion(DiscussionDTO discussion){
            var d = new Discussion {};

            await _context.Discussions.AddAsync(d);
            await _context.SaveChangesAsync();
            var id = d.Id;
            foreach (var user in discussion.Participants)
            {
                var participant = await _context.Users.FirstOrDefaultAsync(u => u.Pseudo == user);
                var userD = new UserDiscussion {
                    UserId =   participant.Id,
                    DiscussionId = id
                };
                await _context.UserDiscussions.AddAsync(userD);
            }
            await _context.SaveChangesAsync();
             return d.DiscussionToDTO() ;
        }
    }
}