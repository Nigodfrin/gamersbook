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
    [Route("api/postsQuestion")]
    [ApiController]
    public class PostsQuestionController : ControllerBase
    {
        private readonly Context _context;

        public PostsQuestionController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> GetAll()
        {
            var posts = await _context.Posts.Where(p => p.Title != null).ToListAsync();
            return posts.PostQuestToDTO();
        }
 
        [HttpGet("{id}")]
        public async Task<ActionResult<PostQuestionDTO>> GetPostById(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound();
            return post.PostQuestToDTO();
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

        [HttpGet("filter/{filter}")]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> Filter(string filter)
        {
            var questions = await _context.Posts.Where(p => p.Title != null).ToListAsync();
            if(!string.IsNullOrWhiteSpace(filter)){
                StringComparison comp = StringComparison.OrdinalIgnoreCase;
                questions = questions.Where(
                    question => 
                        question.Body.Contains(filter, comp) ||
                        question.User.Pseudo.Contains(filter, comp) ||
                        (
                            question.Title != null && question.Title.Contains(filter,comp)
                        )
                        || 
                        (
                            question.Comments != null && question.Comments.Any(comment => comment.Body.Contains(filter,comp))
                        )
                        ||
                        (
                            question.Reponses != null && question.Reponses.Any(reponse => reponse.Body.Contains(filter,comp))
                        )
                        || 
                        (
                            question.Tags != null && question.Tags.Any(tag => tag.Name.Contains(filter,comp))
                        )

                ).ToList();
            }
            return questions.PostQuestToDTO();
        }
        [HttpDelete("{id}")]
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