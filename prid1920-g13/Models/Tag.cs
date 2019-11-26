
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_1819_g13.Models
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Name Required")]
        public string Name { get; set; }
        [NotMapped]
        public IList<Post> CollectionPosts {get;set;}
        
    }
}