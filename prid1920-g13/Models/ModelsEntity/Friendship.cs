using System;

namespace prid_1819_g13.Models
{
    public class Friendship
    {
        public int RequesterId {get;set;}
        public virtual User Requester {get;set;}
        public int AddresseeId {get;set;}
        public virtual User Addressee {get;set;}
        public DateTime CreatedDateTime {get;set;}
    } 
}