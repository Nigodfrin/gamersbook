using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace prid_1819_g13.Models
{
    public class Post {
        [Key]
        public int Id {get;set;}
        public string Title {get;set;}
        [Required(ErrorMessage = "Required")]
        public string Body {get;set;}
        [Required(ErrorMessage = "Required")]
        public DateTime Timestamp { get{return Timestamp;} set {Timestamp = DateTime.Today;}}
        public virtual ICollection<Post> CollectionPosts {get;set;}
        public virtual ICollection<Vote> CollectionVotes {get;set;}
        public virtual User User {get; set;}
        // public virtual ICollection<Comment> CollectionComments {get;set;}
        // public virtual ICollection<Tag> CollectionTags {get;set;}
        
    }
}