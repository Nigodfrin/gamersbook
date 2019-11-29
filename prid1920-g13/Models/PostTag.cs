using System.ComponentModel.DataAnnotations;

namespace prid_1819_g13.Models {
    public class PostTag {

        public int PostId {get;set;}
        public int TagId {get;set;}
        
         public Tag Tag { get; set; }   
         public Post Post { get; set; }
    }
}