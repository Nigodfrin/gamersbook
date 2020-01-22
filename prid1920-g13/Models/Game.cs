using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace prid_1819_g13.Models
{
    
    public class Game
    {
        [Key]
        public int Id {get;set;}
        public string Name {get;set;}
        public string Genre {get;set;}
        public string Released {get;set;}
        public List<string> Plateform {get;set;}
    }
}
