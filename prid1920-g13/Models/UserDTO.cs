using System;
using System.Collections.Generic;
namespace prid_1819_g13.Models {
    public class UserDTO {
        public int Id {get; set;}
        public string Pseudo { get; set; }
        public string Password { get; set; }
        public string FirstName {get; set;}
        public string LastName { get; set; }
        public string Email {get; set;}
        public DateTime? BirthDate { get; set; }
        public int Reputation {get; set;}
        public Role Role { get; set; }
        public IList<VoteDTO> Votes {get;set;}
        public IList<CommentDTO> Comments {get;set;}
       public IList<PostQuestionDTO> PostQ {get;set;}
       public IList<PostReponseDTO> PostR {get;set;}
    }
}