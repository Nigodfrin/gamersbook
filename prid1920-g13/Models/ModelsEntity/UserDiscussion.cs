namespace prid_1819_g13.Models
{
    public class UserDiscussion
    {
        public int UserId {get;set;}
        public virtual User User {get;set;}
        public int DiscussionId {get;set;}
        public virtual Discussion ownedDiscussion {get;set;}
    }
}