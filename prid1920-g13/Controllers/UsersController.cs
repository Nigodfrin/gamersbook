using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using prid_1819_g13.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
using System.Security.Claims;
using prid_1819_g13.Helpers;
using System;
using PRID_Framework;
using System.Linq;

namespace prid_1819_g13.Controllers
{
    [Authorize]
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly Context _context;

        public UsersController(Context context)
        {
            _context = context;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll()
        {
            return (await _context.Users.ToListAsync()).ToDTO();
        }
        [Authorized(Role.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDTO data)
        {
            var user = await _context.Users.FindAsync(id);

            if (id != user.Id)
            {
                return BadRequest();
            }
             if (!string.IsNullOrWhiteSpace(data.PicturePath))
                // On ajoute un timestamp à la fin de l'url pour générer un URL différent quand on change d'image
                // car sinon l'image ne se rafraîchit pas parce que l'url ne change pas et le browser la prend dans la cache.
                user.PicturePath = data.PicturePath + "?" + DateTime.Now.Ticks;
            else
                user.PicturePath = null;
            user.Pseudo = data.Pseudo;
            user.LastName = data.LastName;
            if (data.Password != null)
            {
                user.Password = data.Password;
            }
            user.BirthDate = data.BirthDate;
            user.Email = data.Email;
            user.FirstName = data.FirstName;

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("search/{name}")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> userSearch(string name){
            return (await _context.Users.Where(u => u.Pseudo.ToLower().Contains(name.ToLower())).ToListAsync()).ToDTO();
        }
        [HttpPost]
        public async Task<ActionResult<UserDTO>> CreateUser(UserDTO data)
        {
            
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Pseudo == data.Pseudo);
            if (user != null)
            {
                var err = new ValidationErrors().Add("Pseudo already in use", nameof(user.Pseudo));
                return BadRequest(err);
            }
            var newUser = new User()
            {
                Pseudo = data.Pseudo,
                Password = TokenHelper.GetPasswordHash(data.Password),
                LastName = data.LastName,
                FirstName = data.FirstName,
                BirthDate = data.BirthDate,
                Email = data.Email,
                PicturePath = data.PicturePath
            };
            _context.Users.Add(newUser);
            var res = await _context.SaveChangesAsyncWithValidation();
            var userN = await this.GetOneUser(newUser.Pseudo);
            // await new UserNeo4JController().CreateUser(userN.Value);
            if (!res.IsEmpty)
                return BadRequest(res);

            return CreatedAtAction(nameof(GetOneUser), new { pseudo = newUser.Pseudo }, newUser.ToDTO());
        }

        [HttpGet("{pseudo}")]
        public async Task<ActionResult<UserDTO>> GetOneUser(string pseudo)
        {
            var user = await _context.Users.FirstOrDefaultAsync(p => p.Pseudo == pseudo);
            if (user == null)
                return NotFound();
            return user.ToDTO();
        }
        [Authorized(Role.Admin)]
        [HttpDelete("{pseudo}")]
        public async Task<IActionResult> DeleteUser(string pseudo)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Pseudo == pseudo);

            if (user == null)
            {
                return NotFound();
            }

            _context.Votes.RemoveRange(user.Votes);
            var postsAccepted = await _context.Posts.Where(p => p.User.Id == user.Id && p.AcceptedPostId != null).ToListAsync();
            foreach(var postAccepted in postsAccepted){
                postAccepted.AcceptedPostId = null;
                _context.Entry(postAccepted).State = EntityState.Modified;
            }
            _context.SaveChanges();
            foreach (var post in user.Posts)
            {
                if(post.Title == null){await DeleteR(post);}
                else { DeleteQ(post);}
                   
                
            }
            _context.Comments.RemoveRange(user.Comments);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<IActionResult> DeleteR(Post post)
        {
            var question = await _context.Posts.FindAsync(post.ParentId);
            if (post == null)
            {
                return NotFound();
            }
            _context.Votes.RemoveRange(post.Votes);
            _context.Comments.RemoveRange(post.Comments);
            _context.Posts.Remove(post);
            return NoContent();
        }

        private void DeleteQ(Post question)
        {
            _context.Comments.RemoveRange(question.Comments);

                // supprime les reponses associé a une question
                foreach (var rep in question.Reponses)
                {
                    //supprime les commentaire asssocié a une reponse
                    _context.Comments.RemoveRange(rep.Comments);
                    //supprime les votes
                    _context.Votes.RemoveRange(rep.Votes);
                    // supprime la réponse
                    _context.Posts.Remove(rep);
                }
                // supprime les postTag associé a la question
                _context.PostTags.RemoveRange(question.PostTags);
                // supprime les votes associés à la question
                _context.Votes.RemoveRange(question.Votes);
                // supprime la question
                _context.Posts.Remove(question);
        }

        [AllowAnonymous]
        [HttpGet("available/{pseudo}")]
        public async Task<ActionResult<bool>> IsAvailable(string pseudo)
        {
            var member = await _context.Users.FirstOrDefaultAsync(x => x.Pseudo == pseudo);
            return member == null;
        }
        [AllowAnonymous]
        [HttpGet("verif/{email}")]
        public async Task<ActionResult<bool>> IsAvailableEmail(string email)
        {
            var e = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            return e == null;
        }
        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<ActionResult<UserDTO>> SignUp(UserDTO data)
        {
            return await CreateUser(data);
        }
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<ActionResult<User>> Authenticate(UserDTO data)
        {
            var user = await Authenticate(data.Pseudo, data.Password);
            if (user == null)
                return BadRequest(new ValidationErrors().Add("User not found", "Pseudo"));
            if (user.Token == null)
                return BadRequest(new ValidationErrors().Add("Incorrect password", "Password"));
            return Ok(user.ToDTO());
        }
        private async Task<User> Authenticate(string pseudo, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
            // return null if member not found
            if (user == null)
                return null;
            if (user.Password == TokenHelper.GetPasswordHash(password))
            {
                // authentication successful so generate jwt token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("my-super-secret-key");
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                                                 {
                                             new Claim(ClaimTypes.Name, user.Pseudo),
                                             new Claim(ClaimTypes.Role, user.Role.ToString())
                                                 }),
                    IssuedAt = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddHours(2),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                user.Token = tokenHandler.WriteToken(token);
            }
            // remove password before returning
            user.Password = null;
            return user;
        }
        [HttpGet("isAuthor/{id}")]
        public async Task<ActionResult<bool>> isAuthor(int id){
            var pseudo = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(p => p.Pseudo == pseudo);
            var post = await _context.Posts.FindAsync(id);
            return user.Id == post.AuthorId;
        }
        [HttpPut("reput/{authorid}/{id}")]
        public async Task<IActionResult> UpdateReputaion(int authorid, int id)
        {
            var user = await _context.Users.FindAsync(authorid);
            var createurquestion = await _context.Users.FindAsync(id);

            if (authorid != user.Id || id != createurquestion.Id)
            {
                return BadRequest();
            }
            user.Reputation += 15;
            createurquestion.Reputation += 2;

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("reputation/{id}/{valeur}")]
        public async Task<IActionResult> UpdateReputaionVote(int id, int valeur)
        {
            var post = await _context.Posts.FindAsync(id);
            var user = await _context.Users.FindAsync(post.AuthorId);
            var pseudo = User.Identity.Name;
            var currentuser = await _context.Users.FirstOrDefaultAsync(x => x.Pseudo == pseudo);

            if (user.Id != post.AuthorId)
            {
                return BadRequest();
            }
            if (valeur == 1)
            {
                user.Reputation += 10;
            }
            else
            {
                user.Reputation -= 2;
                currentuser.Reputation -= 1;
            }

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("userPostsRep/{id}")]
        public async Task<ActionResult<IEnumerable<PostReponseDTO>>> getUserRep(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if(user == null){
                return BadRequest();
            }
            var posts = await _context.Posts.Where(post => post.User.Id == user.Id && post.Title == null).ToListAsync();

            return posts.PostRepToDTO();

        }
        [HttpGet("userPostsQuest/{id}")]
        public async Task<ActionResult<IEnumerable<PostQuestionDTO>>> getUserQuest(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if(user == null){
                return BadRequest();
            }
            var posts = await _context.Posts.Where(post => post.AuthorId == user.Id && post.Title != null).ToListAsync();

            return posts.PostQuestToDTO();
        }
        [HttpGet("userComment/{id}")]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> getUserComment(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if(user == null){
                return BadRequest();
            }
            var comments = await _context.Comments.Where(comment => comment.AuthorId == user.Id).ToListAsync();

            return comments.ToDTO();
        }
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] string pseudo, [FromForm]IFormFile picture) {
            if (picture != null && picture.Length > 0) {
                //var fileName = Path.GetFileName(picture.FileName);
                var fileName = pseudo + "-" + DateTime.Now.ToString("yyyyMMddHHmmssff") + ".jpg";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads", fileName);
                using (var fileSrteam = new FileStream(filePath, FileMode.Create)) {
                    await picture.CopyToAsync(fileSrteam);
                }
                return Ok($"\"uploads/{fileName}\"");
            }
            return Ok();
        }
        [HttpPost("cancel")]
        public IActionResult Cancel([FromBody] dynamic data) {
            string picturePath = data.picturePath;
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", picturePath);
            if (System.IO.File.Exists(path))
                System.IO.File.Delete(path);
            return Ok();
        }

        [HttpPost("confirm")]
        public IActionResult Confirm([FromBody] dynamic data) {
            string pseudo = data.pseudo;
            string picturePath = data.picturePath;
            string newPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads", pseudo + ".jpg");
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", picturePath);
            if (System.IO.File.Exists(path)) {
                if (System.IO.File.Exists(newPath))
                    System.IO.File.Delete(newPath);
                System.IO.File.Move(path, newPath);
            }
            return Ok();
        }
        [HttpGet("getFriends")]
        public async Task<ActionResult<List<UserDTO>>> GetFriends()
        {
            var pseudo = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Pseudo == pseudo);
            return user.Friends.ToDTO();
        }
        [HttpPost("acceptFriend")]
        public async Task<IActionResult> AcceptFriendship(int id)
        {
            var pseudo = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Pseudo == pseudo);    

            var friendship = await _context.Friendships.FirstOrDefaultAsync(f => f.AddresseeId == user.Id && f.RequesterId == id);
            if(friendship == null)
                return BadRequest();
            friendship.IsAccepted = true;
            _context.Entry(friendship).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // [HttpDelete("refuseFriend/{pseudo}")]
        // public async Task<IActionResult> refuseFriendship (string pseudo){
        //     await this.Client.ConnectAsync();
        //     var connectPseudo = User.Identity.Name;
        //     this.Client.Cypher
        //     .Match("(me:User)-[h:Has]->(n:Notification)")
        //     .Where((UserNeo4J me) => me.Pseudo == connectPseudo)
        //     .AndWhere((NotificationNeo4J n) => n.SenderPseudo == pseudo && n.Type == "Relationship")
        //     .DetachDelete("n")
        //     .ExecuteWithoutResultsAsync()
        //     .Wait();
        //     return NoContent();
        // }
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> deleteFriend(int id){
        //     await this.Client.ConnectAsync();
        //     var pseudo = User.Identity.Name;
        //     this.Client.Cypher
        //     .Match("(me:User)-[r:friend]-(oldFriend:User)")
        //     .Where((UserNeo4J oldFriend) => oldFriend.Id == id)
        //     .AndWhere((UserNeo4J me) => me.Pseudo == pseudo)
        //     .Delete("r")
        //     .ExecuteWithoutResultsAsync()
        //     .Wait();
        //     return NoContent();
        // }
        [HttpGet("{pseudo}")]
        public async Task<List<GameDTO>> GetAll(string pseudo)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Pseudo == pseudo);
            var games = user.Games;
            return games.GamesToDTO();
        }
        [HttpGet("notifications")]
        public async Task<List<NotificationDTO>> GetNotifications()
        {
            var pseudo = User.Identity.Name;
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Pseudo == pseudo);
            var notifications = user.Notifications.ToList();
            return notifications.NotificationsToDTO();
        }
        [HttpPost("addFriend")]
        public async Task<ActionResult> AddFriend(UserDTO friend)
        {
            var pseudo = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Pseudo == pseudo);

            var friendship = new Friendship(){
                RequesterId = user.Id,
                AddresseeId = friend.Id,
            };
            _context.Friendships.Add(friendship);
            var notif = new Notification(){
                SenderId = user.Id,
                ReceiverId = friend.Id,
                NotificationType = NotificationTypes.Friendship,
            };
            _context.Notifications.Add(notif);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // [HttpPost]
        // public async Task<ActionResult<GameDTO>> AddGameToUser(GameDTO data)
        // {
        //     var pseudo = User.Identity.Name;
        //     if(pseudo == null){
        //         return Unauthorized();
        //     }
        //                 var game = new Game(){
        //         Id = data.Id,
        //         Deck = data.Deck,
        //         Expected_release_day = data.Expected_release_day,
        //         Expected_release_month = data.Expected_release_month,
        //         Expected_release_year = data.Expected_release_year,
        //         Name = data.Name,
        //         Image = data.Image
        //     };

        //     return NoContent();
            
        // }
    }

}