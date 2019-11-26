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
        public int? ParentId {get;set;}
        public int? AcceptedPostId {get;set;}
        [NotMapped]
        public User User {get; set;}
        [NotMapped]
        public Post ParentPost {get; set;}
        [NotMapped]
        public Post AcceptedPost {get; set;}
        [NotMapped]
        public IList<Post> Posts {get;set;}
        [NotMapped]
        public IList<Vote> Votes {get;set;}
        [NotMapped]
        public IList<Comment> Comments {get;set;}
        [NotMapped]
        public IList<Tag> Tags {get;set;}
        
    }
}