using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using prid_1819_g13.Models;
using Microsoft.AspNetCore.Authorization;
using PRID_Framework;
using System.Linq;
using System;


namespace prid_1819_g13.Controllers
{
    [Authorize]
    [Route("api/posttags")]
    [ApiController]
    public class PostTagController : ControllerBase
    {
        private readonly Context _context;
        public PostTagController(Context context)
        {
            _context = context;
        }
        
        [HttpPost("add")]
        public async Task<ActionResult<PostTagDTO>> CreatePostTag(int[] tagid)
        {
            var posts =  _context.Posts.Last();
            int cmp=0;
            while(cmp < tagid.Length){
            var newPostTag = new PostTag()
            {
                TagId = tagid[cmp],
                PostId = posts.Id
            };
            _context.PostTags.Add(newPostTag);
        }
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }
        
    }
}