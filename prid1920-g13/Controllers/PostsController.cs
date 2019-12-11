using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_1819_g13.Models;
using PRID_Framework;
using prid_1819_g13.Helpers;

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
            var posts = await _context.Posts.Where(p => p.Title != null).ToListAsync();
            return posts.PostQuestToDTO();
        }
        // [HttpGet("last")]
        // public async Task<ActionResult<PostQuestionDTO>> GetLast()
        // {
        //     var posts = await _context.Posts.Where(p => p.Title != null).ToListAsync();
        //     return posts.Last().PostQuestToDTO();
        // }
        [HttpGet("allRep/{id}/{acceptedId}")]
        public async Task<ActionResult<IEnumerable<PostReponseDTO>>> GetAllRep(int id, int acceptedId)
        {
            return (await _context.Posts
            .Where(p => p.ParentId == id && p.Id != acceptedId)
            .OrderByDescending(p => p.Votes.Sum(v => v.UpDown))
            .ToListAsync())
            .PostRepToDTO();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PostQuestionDTO>> GetPostById(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound();
            return post.PostQuestToDTO();
        }
        [HttpGet("rep/{id}")]
        public async Task<ActionResult<PostReponseDTO>> GetPostRepById(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound();
            return post.PostRepToDTO();
        }
        [HttpGet("newest")]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> GetNewest()
        {
            return (await _context.Posts
            .Where(p => p.Title != null)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync())
            .PostQuestToDTO();
        }
        [HttpGet("nonAnswered")]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> GetNonAnswered()
        {
            return (await _context.Posts
            .Where(p => p.Title != null && p.AcceptedPost == null)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync())
            .PostQuestToDTO();
        }
        [HttpGet("withTags")]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> GetWithTags()
        {
            var posts = await _context.Posts.
            Where(p => p.Title != null && p.PostTags.Count() > 0)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
            return Ok(posts.PostQuestToDTO());
        }
        [HttpGet("votes")]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> GetOrderByVotes()
        {
            const string rawSQL = @"
            SELECT posts.*, MaxScore FROM posts, 
            (SELECT parentid, max(Score) MaxScore 
            FROM (
                SELECT posts.Id, ifnull(posts.ParentId, posts.id) ParentId, ifnull(sum(votes.UpDown), 0) Score 
                FROM posts LEFT JOIN votes ON votes.PostId = posts.Id 
                GROUP BY posts.Id,ParentId
                ) as tbl1 
                GROUP by parentid
                ) as q1 
                WHERE posts.id = q1.parentid
                ORDER By q1.MaxScore desc, Timestamp desc;";
            var q = await _context.Posts.FromSql(rawSQL).ToListAsync();
            return q.PostQuestToDTO();
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
                post.Timestamp = DateTime.Now;
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
                    Timestamp = DateTime.Now
                };
                _context.Posts.Add(post);
                var res = await _context.SaveChangesAsyncWithValidation();
                if (!res.IsEmpty)
                    return BadRequest(res);
                return NoContent();
            }

        }

        [HttpGet("putAccepted/{questionId}/{acceptedPostId}")]
        public async Task<ActionResult<PostReponseDTO>> putAcceptedPost(int questionId, int acceptedPostId)
        {
            var question = await _context.Posts.FindAsync(questionId);
            if (questionId != question.Id)
            {
                return BadRequest();
            }
            question.AcceptedPostId = acceptedPostId;

            _context.Entry(question).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Posts.FindAsync(id);

            if (question == null)
            {
                return NotFound();
            }

            while (_context.Posts.Where(x => x.ParentId == id).Count() != 0)
            {
                var res = await _context.Posts.FirstOrDefaultAsync(x => x.ParentId == id);
                _context.Posts.Remove(res);
                await _context.SaveChangesAsync();
            }
            _context.Posts.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorized(Role.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            var question = await _context.Posts.FindAsync(post.ParentId);
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


        [HttpPut]
        public async Task<IActionResult> updatePost(string title, string body, int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return BadRequest();
            }
            post.Title = title;
            post.Body = body;
            _context.Entry(post).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();

        }

    }
}