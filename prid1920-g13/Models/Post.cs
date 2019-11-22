using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_1819_g13.Models
{
    public class Post {
        [Key]
        public int Id {get;set;}
        public string Title {get;set;}
        [Required(ErrorMessage = "Required")]
        public string Body {get;set;}
        [Required(ErrorMessage = "Required")]
        public DateTime Timestamp { get;set;} = DateTime.Now;
        public int UserId {get;set;}
        [NotMapped]
        public ICollection<Post> CollectionPosts {get;set;}
        [NotMapped]
        public ICollection<Vote> CollectionVotes {get;set;}
        [NotMapped]
        public User User {get; set;}
        // public virtual ICollection<Comment> CollectionComments {get;set;}
        // public virtual ICollection<Tag> CollectionTags {get;set;}
        
    }
}