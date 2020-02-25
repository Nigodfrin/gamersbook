using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using PRID_Framework;
using System.Linq;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
using prid_1819_g13.Models;

namespace prid_1819_g13.Controllers
{
    [Authorize]
    [Route("api/userNeo4J")]
    [ApiController]
    public class UserNeo4JController : ControllerBase
    {
        public GraphClient Client= new GraphClient(new Uri("http://localhost:7474/db/data/"), "neo4j", "123")
            {
                JsonContractResolver = new CamelCasePropertyNamesContractResolver()
            };
        public UserNeo4JController(){
        }
        [HttpGet("getFriends")]
        public async Task<ActionResult<IEnumerable<UserNeo4J>>> getFriends()
        {
            var pseudo = User.Identity.Name;
            await this.Client.ConnectAsync();
            var friends = await this.Client.Cypher
            .Match("(me:User)-[:friend]-(friend:User)")
            .Where((UserNeo4J me) => me.Pseudo == pseudo)
            .Return(friend => friend.As<UserNeo4J>())
            .ResultsAsync;
            return friends.ToList();
        }
        [HttpPost("acceptFriend")]
        public async Task<IActionResult> acceptFriendship(string pseudo){
            await this.Client.ConnectAsync();
            var connectPseudo = User.Identity.Name;
            this.Client.Cypher
            .Match("(me:User)<-[r:friend]-(newFriend:User)")
            .Where((UserNeo4J newFriend) => newFriend.Pseudo == pseudo)
            .AndWhere((UserNeo4J me) => me.Pseudo == connectPseudo)
            .OnMatch()
            .Set("r.accepted = true")
            .ExecuteWithoutResultsAsync()
            .Wait();
            return NoContent();
        }
        [HttpDelete("refuseFriend/{pseudo}")]
        public async Task<IActionResult> refuseFriendship (string pseudo){
            await this.Client.ConnectAsync();
            var connectPseudo = User.Identity.Name;
            this.Client.Cypher
            .Match("(sender:User)-[r:friend]->(me:User)")
            .Where((UserNeo4J sender) => sender.Pseudo == pseudo)
            .AndWhere((UserNeo4J me) => me.Pseudo == connectPseudo)
            .Delete("r")
            .ExecuteWithoutResultsAsync()
            .Wait();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> deleteFriend(int id){
            await this.Client.ConnectAsync();
            var pseudo = User.Identity.Name;
            this.Client.Cypher
            .Match("(me:User)-[r:friend]-(oldFriend:User)")
            .Where((UserNeo4J oldFriend) => oldFriend.Id == id)
            .AndWhere((UserNeo4J me) => me.Pseudo == pseudo)
            .Delete("r")
            .ExecuteWithoutResultsAsync()
            .Wait();
            return NoContent();
        }
        [HttpGet("{pseudo}")]
        public async Task<IEnumerable<GameNeo4J>> GetAll(string pseudo)
        {
            await this.Client.ConnectAsync();
            var games = await this.Client.Cypher.
            Match("(u:User)-[:Play]->(g:Game)").
            Where("u.pseudo = {param}")
            .WithParam("param",pseudo).
            Return(g => g.As<GameNeo4J>()).ResultsAsync;
            Console.WriteLine(games);
            return games.ToList();
        }
        [HttpGet("notifications")]
        public async Task<IEnumerable<NotificationNeo4J>> GetNotifications()
        {
            var pseudo = User.Identity.Name;
            
            await this.Client.ConnectAsync();
            var notifications = await this.Client.Cypher.
            Match("(u:User)-[:Has]->(n:Notification)").
            Where("u.pseudo = {param}")
            .WithParam("param",pseudo).
            Return(n => n.As<NotificationNeo4J>()).ResultsAsync;
            Console.WriteLine(notifications);
            return notifications.ToList();
        }
        public async Task CreateUser(UserDTO user){
            await this.Client.ConnectAsync();
            var member = new UserNeo4J(){
                Id = user.Id,
                Pseudo = user.Pseudo
            };
            this.Client.Cypher
            .Create("(u:User {member})")
            .WithParam("member",member)
            .ExecuteWithoutResultsAsync()
            .Wait();
        }
        [HttpPost("addFriend")]
        public async Task AddFriend(UserDTO friend)
        {
            var pseudo = User.Identity.Name;
            await this.Client.ConnectAsync();
            await this.Client.Cypher
            .Match("(ami:User),(me:User)")
            .Where((UserNeo4J ami) => ami.Pseudo == friend.Pseudo)
            .AndWhere((UserNeo4J me) => me.Pseudo == pseudo)
            .Merge("(me)-[:friend {accepted: false}]-(ami)")
            .Create("(ami)-[:Has]->(n:Notification {type: 'Relationship', from: {user},see: false})")
            .WithParam("user",pseudo)
            .ExecuteWithoutResultsAsync();
        }
        [HttpPost]
        public async Task<ActionResult<GameDTO>> AddGame(GameDTO data)
        {
            await this.Client.ConnectAsync();
            var pseudo = User.Identity.Name;
            if(pseudo == null){
                return Unauthorized();
            }
            var rel = await this.Client.Cypher
            .Match("(u:User),(g:Game)")
            .Where((UserNeo4J u) => u.Pseudo == pseudo)
            .AndWhere((GameNeo4J g) => g.Id == data.Id)
            .Return<bool>("exists((u)-[:Play]->(g))").ResultsAsync;
            
            if(rel.FirstOrDefault() == true){
                return Unauthorized();
            }
            var game = new GameNeo4J(){
                Id = data.Id,
                Deck = data.Deck,
                Expected_release_day = data.Expected_release_day,
                Expected_release_month = data.Expected_release_month,
                Expected_release_year = data.Expected_release_year,
                Name = data.Name,
                Image = data.Image
            };
            this.Client.Cypher
            .Match("(u:User)")
            .Where((UserNeo4J u) => u.Pseudo == pseudo)
            .Merge("(g:Game {id: {gameId} })")
            .OnCreate()
            .Set("g = {game}")
            .WithParams(new {
                gameId = game.Id,
                game
            })
            .Merge("(u)-[:Play]->(g)")
            .ExecuteWithoutResultsAsync()
            .Wait();

            return NoContent();
            
        }
    }
}