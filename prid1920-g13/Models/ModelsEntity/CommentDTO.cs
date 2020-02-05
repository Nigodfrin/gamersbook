using System;

namespace prid_1819_g13.Models
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public DateTime Timestamp {get;set;}
        public UserDTO Author {get;set;}
        public int PostId{get;set;}
    }
}