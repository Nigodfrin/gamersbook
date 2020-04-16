namespace prid_1819_g13.Models
{
    public class UserGames
    {
        public int UserId {get;set;}
        public virtual User UserGame {get;set;}
        public int GameId {get;set;}
        public virtual Game ownedGame {get;set;}
    } 
}