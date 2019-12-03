using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using prid_1819_g13.Models;
using Microsoft.AspNetCore.Authorization;
using System;

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
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id ,CommentDTO data)
        {
             var comment = await _context.Comments.FindAsync(id);
             
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

    }
}