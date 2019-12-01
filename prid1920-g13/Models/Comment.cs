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
        public int AuthorId {get;set;}
        public int PostId {get;set;}
        public virtual User User{get;set;}
        public virtual Post Post {get;set;}
    }
}
