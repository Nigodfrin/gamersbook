using Microsoft.AspNetCore.Mvc;
using prid_1819_g13.Models;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Linq;
using PRID_Framework;

namespace prid_1819_g13.Controllers
{
    [Authorize]
    [Route("api/game")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly Context _context;
        public GameController(Context context){
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<GameDTO>> AddGame(GameDTO data)
        {
            var pseudo = User.Identity.Name;
            var game = _context.Games.Find(data.Id);
            var user = _context.Users.FirstOrDefault(p => p.Pseudo == pseudo);
            if(game != null){
                return BadRequest();
            }
            var jeu = new Game(){
                Name = data.Name,
                Expected_release_day = data.Expected_release_day,
                Expected_release_month = data.Expected_release_month,
                Expected_release_year = data.Expected_release_year,
                Deck = data.Deck,
                Image = data.Image
            };
            _context.Games.Add(jeu);
            var res = await _context.SaveChangesAsyncWithValidation();
             var g = _context.Games.FirstOrDefault(game => game.Name == jeu.Name);

            var userGame = new UserGames(){
                UserId = user.Id,GameId = g.Id
            };
            
            _context.UserGames.Add(userGame);
            await _context.SaveChangesAsync();

            if (!res.IsEmpty)
                return BadRequest(res);

            return NoContent();
        }
    }
}