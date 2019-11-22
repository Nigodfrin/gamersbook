using System;
namespace prid_1819_g13.Models {
    public class PostDTO {
        public int Id {get; set;}
        public string Title {get;set;}
        public string Body {get;set;}
        public DateTime Timestamp {get;set;}
        public int UserId {get;set;}
    }
}