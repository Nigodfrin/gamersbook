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
        public UserDTO User {get;set;}
        public int Score {get;set;}
        public int? AcceptedRepId {get;set;}
        public IList<PostReponseDTO> Reponses {get;set;}    
        public IEnumerable<TagDTO> Tags { get; set; }
        public IList<CommentDTO> Comments {get;set;}
        public IList<VoteDTO> Votes {get;set;}
        public int MaxScore {get;set;}
        public int NumUp {get;set;}
        public int NumDown {get;set;}

        
    }
}