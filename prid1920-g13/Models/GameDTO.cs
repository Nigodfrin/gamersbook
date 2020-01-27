using System;

namespace prid_1819_g13
{
    public class GameDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Deck { get; set; }
        public DateTime Expected_released_date { get; set; }
        public string Image { get; set; }
        public string Platforms { get; set; }
    }
}