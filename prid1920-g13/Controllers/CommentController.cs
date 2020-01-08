using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using prid_1819_g13.Models;
using Microsoft.AspNetCore.Authorization;
using System;
using prid_1819_g13.Helpers;
using PRID_Framework;
using System.Linq;

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
        [Authorized(Role.Admin,Role.Member)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id ,CommentDTO data)
        {
             var comment = await _context.Comments.FindAsync(id);
            if(!isAuthorOrAdmin(comment)){
                return Unauthorized();
            }
             
            if (id != comment.Id)
            {
                return BadRequest();
            }
            comment.Body = data.Body;      
            comment.Timestamp = DateTime.Now;
            _context.Entry(comment).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorized(Role.Admin,Role.Member)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if(!isAuthorOrAdmin(comment)){
                return Unauthorized();
            }
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorized(Role.Admin,Role.Member)]
        [HttpPost]
        public async Task<ActionResult<VoteDTO>> CreateComment(CommentDTO data)
        {
            var newComment = new Comment()
            {             
                Body = data.Body,
                AuthorId = data.Author.Id,
                PostId = data.PostId,
                Timestamp = data.Timestamp
            };
            _context.Comments.Add(newComment);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            return NoContent();
        }
        private bool isAuthorOrAdmin(Comment comment){
            var pseudo = User.Identity.Name;
            var user =  _context.Users.FirstOrDefault(x => x.Pseudo == pseudo);

            return user.Id == comment.AuthorId || user.Role.ToString() == "Admin" ;
        }

    }
}