using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using prid_1819_g13.Models;
using Microsoft.AspNetCore.Authorization;
using PRID_Framework;
using System.Linq;
using System;
using prid_1819_g13.Helpers;

namespace prid_1819_g13.Controllers
{
    [Authorize]
    [Route("api/tags")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly Context _context;
        public TagController(Context context)
        {
            _context = context;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDTO>>> GetAll()
        {
            return (await _context.Tags.ToListAsync()).ToDTO();  
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<int>> GetnumberTag(int id)
        {
            var tmp = await _context.PostTags.Where(x => x.TagId == id).ToListAsync();
            return tmp.Count;

        }
        [Authorized(Role.Admin)]
        [HttpPost]
        public async Task<ActionResult<TagDTO>> CreateTag(TagDTO data)
        {
            var tag = await _context.Tags.FirstOrDefaultAsync(x => x.Name == data.Name);
            if (tag != null)
            {
                var err = new ValidationErrors().Add("Tag already exist", nameof(tag.Name));
                return BadRequest(err);
            }
            var newTag = new Tag()
            {
                Name = data.Name
            };
            _context.Tags.Add(newTag);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return CreatedAtAction(nameof(GetOneTag), new { name = newTag.Name }, newTag.ToDTO());
        }
        [Authorized(Role.Admin)]
        [HttpGet("{name}")]
        public async Task<ActionResult<TagDTO>> GetOneTag(string name)
        {
            var tag = await _context.Tags.FindAsync(name);
            if (tag == null)
                return NotFound();
            return tag.ToDTO();
        }
        [Authorized(Role.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var tag = await _context.Tags.FindAsync(id);

            if (tag == null)
            {
                return NotFound();
            }

            var postTags = await _context.PostTags.Where(p => p.TagId == id).ToListAsync();
            _context.PostTags.RemoveRange(postTags);
            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorized(Role.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTag(int id, TagDTO data)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return BadRequest();
            }
            tag.Name = data.Name;
            _context.Entry(tag).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorized(Role.Admin)]
        [HttpGet("available/{name}")]
        public async Task<ActionResult<bool>> IsAvailable(string name) {
            var tag = await _context.Tags.FirstOrDefaultAsync( x => x.Name == name);
            return tag == null;
        }
    }

}