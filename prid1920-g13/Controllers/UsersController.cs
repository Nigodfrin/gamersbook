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
        [Authorized(Role.Admin)]
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
            };
            _context.Users.Add(newUser);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            return CreatedAtAction(nameof(GetOneUser), new { pseudo = newUser.Pseudo }, newUser.ToDTO());
        }
        [HttpGet("{pseudo}")]
        public async Task<ActionResult<UserDTO>> GetOneUser(string pseudo)
        {
            var user = await _context.Users.FindAsync(pseudo);
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
            foreach (var post in user.Posts)
            {
               while (_context.PostTags.Where(x => x.PostId == post.Id).Count() != 0)
                {
                    var postTag = await _context.PostTags.FirstOrDefaultAsync(x => x.PostId == post.Id);
                    _context.PostTags.Remove(postTag);
                }
            }
            // _context.Posts.RemoveRange(user.Posts.Where(p => p.Title == null));
            // _context.Posts.RemoveRange(user.Posts.Where(p => p.Title != null));
            _context.Comments.RemoveRange(user.Comments);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
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
    }

}