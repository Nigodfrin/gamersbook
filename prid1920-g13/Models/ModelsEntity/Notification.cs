using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
public enum NotificationTypes {
    FriendshipInvitation,
    RequestFriendshipResponse, 
    EventInvitation,
    RequestEventParticipation
}
    public class Notification
    {
        [Key]
        public int Id {get;set;}
        public int SenderId {get;set;}
        public virtual User Sender {get;set;}
        public int ReceiverId {get;set;}
        public virtual User Receiver {get;set;}
        public int? EventId {get;set;}
        public virtual Event Event {get;set;}
        public bool See {get;set;} = false;
        public virtual NotificationTypes NotificationType {get;set;}
        public DateTime CreatedOn {get;set;} = DateTime.Now;
    }
}