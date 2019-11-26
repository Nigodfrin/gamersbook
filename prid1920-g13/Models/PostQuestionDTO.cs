using System;
using System.Collections.Generic;

namespace prid_1819_g13.Models
{
    public class PostQuestionDTO
    {
        public int Id { get; set; }
        public string Title {get;set;}
        public string Body { get; set; }
        public DateTime Timestamp {get;set;}
        public int UserId {get;set;}
        public IList<PostReponseDTO> Posts {get;set;}    
        public IList<TagDTO> Tags {get;set;}
        public IList<CommentDTO> Comments {get;set;}
    }
}