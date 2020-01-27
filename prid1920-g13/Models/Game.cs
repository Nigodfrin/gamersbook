using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid_1819_g13.Models
{
    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Deck { get; set; }
        public DateTime Expected_released_date {get;set;}

        public string Image { get; set; }
        public string Platforms { get; set; }
        [NotMapped]
        public virtual IList<UserGames> UserGames { get; set; } = new List<UserGames>();
        [NotMapped]
        public IEnumerable<User> Users
        {
            get => UserGames.Select(g => g.UserGame);
        }
    }


}
