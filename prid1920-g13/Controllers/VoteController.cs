using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_1819_g13.Models;
using PRID_Framework;

namespace prid_1819_g13.Controllers
{
    // [Authorize]
    [Route("api/votes")]
    [ApiController]
    public class VoteController : ControllerBase
    {
        private readonly Context _context;
        public VoteController(Context context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult<VoteDTO>> CreateUser(VoteDTO data)
        {
            var vote = await _context.Votes.FindAsync(data.AuthorId,data.PostId);
            if (vote != null && vote.UpDown == data.UpDown)
            {
                var err = new ValidationErrors().Add("Vote already exist", nameof(vote.AuthorId));
                return BadRequest(err);
            }
            var newVote = new Vote()
            {             
                UpDown = data.UpDown,
                AuthorId = data.AuthorId,
                PostId = data.PostId
            };
            if(vote != null)
                _context.Votes.Remove(vote);
            _context.Votes.Add(newVote);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            return CreatedAtAction(nameof(GetOneVote), new { authorId = newVote.AuthorId, postId = newVote.PostId }, newVote.ToDTO());
        }
        [HttpGet("{authorId}/{postId}")]
        public async Task<ActionResult<VoteDTO>> GetOneVote(int authorId,int postId)
        {
            var vote = await _context.Votes.FindAsync(authorId,postId);
            if (vote == null)
                return NotFound();
            return vote.ToDTO();
        }
    }
}