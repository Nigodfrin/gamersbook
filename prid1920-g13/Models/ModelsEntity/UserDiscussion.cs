using System.ComponentModel.DataAnnotations.Schema;

namespace prid_1819_g13.Models
{
    public class UserDiscussion
    {
        public int UserId {get;set;}
        [NotMapped]
        public virtual User User {get;set;}
        public int DiscussionId {get;set;}
        [NotMapped]
        public virtual Discussion OwnedDiscussion {get;set;}
    }
}