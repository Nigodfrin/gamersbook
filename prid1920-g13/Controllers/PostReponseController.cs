using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_1819_g13.Models;
using PRID_Framework;
using prid_1819_g13.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace prid_1819_g13.Controllers
{
    [Authorize]
    [Route("api/postRep")]
    [ApiController]
    public class PostReponseController : ControllerBase
    {
        private readonly Context _context;

        public PostReponseController(Context context)
        {
            _context = context;
        }
         [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<PostReponseDTO>>> GetAllRep(int id)
        {
            return (await _context.Posts
            .Where(p => p.ParentId == id)
            .OrderByDescending(p => p.Votes.Sum(v => v.UpDown))
            .ToListAsync())
            .PostRepToDTO();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PostReponseDTO>> GetPostRepById(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound();
            return post.PostRepToDTO();
        }
        [HttpPost]
        public async Task<ActionResult<PostQuestionDTO>> CreatePost(PostReponseDTO data)
        {
            var post = await _context.Posts.FindAsync(data.Id);
            if (post != null)
            {
                if (data.Id != post.Id)
                {
                    return BadRequest();
                }
                post.Body = data.Body;
                _context.Entry(post).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            else
            {
                post = new Post()
                {
                    AuthorId = data.User.Id,
                    ParentId = data.ParentId,
                    Body = data.Body,
                };
                _context.Posts.Add(post);
                var res = await _context.SaveChangesAsyncWithValidation();
                if (!res.IsEmpty)
                    return BadRequest(res);
                return NoContent();
            }

        }
        [Authorized(Role.Admin,Role.Member)]
        [HttpGet("putAccepted/{questionId}/{acceptedPostId}")]
        public async Task<ActionResult<PostQuestionDTO>> putAcceptedPost(int questionId, int acceptedPostId)
        {
            var pseudo = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Pseudo == pseudo); 
            var question = await _context.Posts.FindAsync(questionId);
            if(user.Id != question.User.Id){
                return Unauthorized();
            }
            if (questionId != question.Id)
            {
                return BadRequest();
            }
            question.AcceptedPostId = acceptedPostId;

            _context.Entry(question).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return question.PostQuestToDTO();
        }
        [Authorized(Role.Admin,Role.Member)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pseudo = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Pseudo == pseudo);
            var post = await _context.Posts.FindAsync(id);
            var question = await _context.Posts.FindAsync(post.ParentId);
            if(user.Role.ToString() != "Admin" && (user.Id != post.User.Id || post.Comments.Count() != 0)){
                return Unauthorized();
            }
            if (post == null)
            {
                return NotFound();
            }
            if (question.AcceptedPostId == post.Id)
            {
                question.AcceptedPostId = null;
                _context.Entry(question).State = EntityState.Modified;
            }
            _context.Votes.RemoveRange(post.Votes);
            _context.Comments.RemoveRange(post.Comments);
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}