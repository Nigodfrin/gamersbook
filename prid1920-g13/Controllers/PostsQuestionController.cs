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
    [Authorize]
    [Route("api/postsQuestion")]
    [ApiController]
    public class PostsQuestionController : ControllerBase
    {
        private readonly Context _context;

        public PostsQuestionController(Context context)
        {
            _context = context;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> GetAll()
        {
            var posts = await _context.Posts.Where(p => p.Title != null).ToListAsync();
            return posts.PostQuestToDTO();
        }
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<PostQuestionDTO>> GetPostById(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound();
            return post.PostQuestToDTO();
        }


        public List<Post> GetNewest(List<Post> questions)
        {
            return (questions
            .OrderByDescending(a => a.Timestamp)
            .ToList());
        }


        public List<Post> GetNonAnswered(List<Post> questions)
        {
            return (questions
            .Where(p => p.AcceptedPost == null)
            .OrderByDescending(a => a.Timestamp)
            .ToList());
        }

        public List<Post> GetWithTags(List<Post> questions,string filter)
        {
            var posts = questions.
            Where(p => p.PostTags.Count() > 0 && p.Tags.Any(t => t.Name.Contains(filter)))
            .OrderByDescending(a => a.Timestamp)
            .ToList();
            return posts;
        }
        public List<Post> GetOrderByVotes(List<Post> questions)
        {
            var q = questions.AsEnumerable().OrderByDescending(p => p.MaxScore).ToList();
            return q;

        }
        [AllowAnonymous]
        [HttpGet("filter/{selectedVal}")]
        [HttpGet("filter/{selectedVal}/{filter}")]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> Filter(string selectedVal, string filter = "")
        {
            var questions = await _context.Posts.Where(p => p.Title != null).ToListAsync();
            if (!string.IsNullOrWhiteSpace(filter))
            {
                StringComparison comp = StringComparison.OrdinalIgnoreCase;
                questions = questions.Where(
                    question =>
                        question.Body.Contains(filter, comp) ||
                        question.User.Pseudo.Contains(filter, comp) ||
                        (
                            question.Title != null && question.Title.Contains(filter, comp)
                        )
                        ||
                        (
                            question.Comments != null && question.Comments.Any(comment => comment.Body.Contains(filter, comp))
                        )
                        ||
                        (
                            question.Reponses != null && question.Reponses.Any(reponse => reponse.Body.Contains(filter, comp))
                        )
                        ||
                        (
                            question.Tags != null && question.Tags.Any(tag => tag.Name.Contains(filter, comp))
                        )

                ).ToList();
            }
            if (selectedVal == "newest")
            {
                questions = this.GetNewest(questions);
            }
            if (selectedVal == "votes")
            {
                questions = GetOrderByVotes(questions);
            }
            if (selectedVal == "tags")
            {
                questions = this.GetWithTags(questions,filter);
            }
            if (selectedVal == "unanswered")
            {
                questions = this.GetNonAnswered(questions);
            }
            return questions.PostQuestToDTO();
        }
        [Authorized(Role.Admin,Role.Member)]
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
            if (data.Tags != null)
            {
                var postTag = data.Tags.Select(x => new PostTag { TagId = x.Id });
                newQuestion.PostTags.AddRange(postTag);
            }

            _context.Posts.Add(newQuestion);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }
        [Authorized(Role.Admin,Role.Member)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Posts.FindAsync(id);
            var pseudo = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Pseudo == pseudo);
            if(user.Role.ToString() != "Admin" && !(user.Id == question.AuthorId && _context.Posts.Where(x => x.ParentId == id).Count() == 0 && _context.Comments.Where(x => x.PostId == question.Id).Count() == 0)){
                return Unauthorized();
            }

            if (question == null)
            {
                return NotFound();
            }
                // supprime les commentaire associé a une question
                _context.Comments.RemoveRange(question.Comments);

                // supprime les reponses associé a une question
                foreach (var rep in question.Reponses)
                {
                    if(rep.Id == question.AcceptedPostId){
                        question.AcceptedPostId = null;
                        _context.Entry(question).State = EntityState.Modified;
                    }
                    //supprime les commentaire asssocié a une reponse
                    _context.Comments.RemoveRange(rep.Comments);
                    //supprime les votes
                    _context.Votes.RemoveRange(rep.Votes);
                    // supprime la réponse
                    _context.Posts.Remove(rep);
                }
                _context.SaveChanges();
                // supprime les postTag associé a la question
                _context.PostTags.RemoveRange(question.PostTags);
                // supprime les votes associés à la question
                _context.Votes.RemoveRange(question.Votes);
                // supprime la question
                _context.Posts.Remove(question);

                var res = await _context.SaveChangesAsyncWithValidation();
                if (!res.IsEmpty)
                {

                    return BadRequest(res);
                }
            return NoContent();
        }
        [Authorized(Role.Admin,Role.Member)]
        [HttpPut]
        public async Task<IActionResult> updatePost(PostQuestionDTO data)
        {
            var pseudo = User.Identity.Name;
            var user = _context.Users.FirstOrDefault(p => p.Pseudo == pseudo);
            var post = await _context.Posts.FindAsync(data.Id);

            if (post == null)
            {
                return BadRequest();
            }
            if (user.Id != post.AuthorId && user.Role.ToString() != "Admin")
            {
                return Unauthorized();
            }
            post.Title = data.Title;
            post.Body = data.Body;
            if (data.Tags != null)
            {
                while (_context.PostTags.Where(x => x.PostId == data.Id).Count() != 0)
                {
                    var postTag = await _context.PostTags.FirstOrDefaultAsync(x => x.PostId == data.Id);
                    _context.PostTags.Remove(postTag);
                    await _context.SaveChangesAsync();
                }
                var newpostTag = data.Tags.Select(x => new PostTag { TagId = x.Id });
                post.PostTags.AddRange(newpostTag);

            }
            _context.Entry(post).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();

        }
        [Authorized(Role.Admin,Role.Member)]
        [HttpPut("removeAcceptAnswer")]
        public async Task<ActionResult<PostQuestionDTO>> removeAcceptAnswer(PostQuestionDTO data)
        {
            var pseudo = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Pseudo == pseudo); 
            var question = await _context.Posts.FindAsync(data.Id);
            if (question == null)
            {
                return BadRequest();
            }
            if(user.Id != question.User.Id){
                return Unauthorized();
            }
            question.AcceptedPostId = null;
            _context.Entry(question).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return question.PostQuestToDTO();
        }

    }
}