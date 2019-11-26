using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_1819_g13.Models
{
    public class Comment
    {
        [Key]
        [Required(ErrorMessage = "Required")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Body is Required")]
        public string Body { get; set; }
        [Required(ErrorMessage = "Timestamp is required")]
        public DateTime Timestamp {get;set;} = DateTime.Now;
        public int UserId {get;set;}
        public int PostId {get;set;}
        [NotMapped]
        public User User{get;set;}
        [NotMapped]
        public Post Post {get;set;}
    }
}
