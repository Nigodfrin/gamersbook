using System;
using System.Collections.Generic;

namespace prid_1819_g13.Models
{
    public class PostReponseDTO
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public DateTime Timestamp {get;set;}
        public UserDTO Author {get;set;}
        public int Score {get;set;}
        public IList<VoteDTO> Votes {get;set;}
        public IList<CommentDTO> Comments {get;set;}
    }
}