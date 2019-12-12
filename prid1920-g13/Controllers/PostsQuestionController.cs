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
             // var q =  _context.Posts
            //     .SelectMany(p => p.Votes.DefaultIfEmpty(), (p, v) => new
            //     {
            //         p.Id,
            //         ParentId = p.ParentId == null ? p.Id : p.ParentId,
            //         UpDown = v == null ? 0 : v.UpDown,
            //     })
            //     .GroupBy(pv => new { pv.Id, pv.ParentId })
            //     .Select(g => new { g.Key.Id, g.Key.ParentId, Score = g.Sum(pv => pv.UpDown) })
            //     .AsEnumerable()   // obligé de ramener les données et de faire le reste en mémoire car EF n'accepte pas 2 GroupBy
            //     .GroupBy(p => p.ParentId)
            //     .Select(g => new { Post = _context.Posts.Where(p => p.Id == g.Key).SingleOrDefault(), MaxScore = g.Max(p => p.Score) })
            //     .OrderByDescending(r => r.MaxScore)
                
            //     ;
            //     var posts = new List<Post>();
            //     foreach (var item in q)
            //     {
            //         item.Post.MaxScore = item.MaxScore;
            //         posts.Add(item.Post);
            //     };
            // return posts.PostQuestToDTO();
            var q =  _context.Posts.Where(p => p.Title != null).AsEnumerable().OrderByDescending(p => p.MaxScore).ToList();
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
        [HttpPost("add")]
        public async Task<ActionResult<PostQuestionDTO>> CreateQuestion(PostQuestionDTO data)
        {
            var pseudo = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Pseudo == pseudo);
            var newQuestion = new Post()
            {
                AuthorId = user.Id,
                ParentId = null,
                Title = data.Title,
                Body = data.Body,
            };
            if(data.Tags != null){
                var postTag = data.Tags.Select( x => new PostTag { TagId = x.Id});
                newQuestion.PostTags.AddRange(postTag);
            }

            _context.Posts.Add(newQuestion);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
           //  return CreatedAtAction( nameof(GetQuest),new { id = newQuestion.Id},  newQuestion.PostQuestToDTO());
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
        public async Task<IActionResult> updatePost(PostQuestionDTO data)
        {
            var post = await _context.Posts.FindAsync(data.Id);
            if (post == null)
            {
                return BadRequest();
            }
            post.Title = data.Title;
            post.Body = data.Body;
            _context.Entry(post).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();

        }

    }
}