
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid_1819_g13.Models
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Name Required")]
        public string Name { get; set; }
        [NotMapped]
        public IEnumerable<Tag> Tags
        {
            get => PostTags.Select(f => f.Tag);
        }
        public virtual List<PostTag> PostTags { get; set; } =new List<PostTag>();
        
        // public IList<Post> CollectionPosts {get;set;}
    }
}