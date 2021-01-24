using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
    public enum NotificationTypes{
        Friendship,
        EventInvitation
    }
    public class Notification
    {
        [Key]
        public int Id {get;set;}
        public int SenderId {get;set;}
        [NotMapped]
        public User Sender {get;set;}
        public bool See {get;set;}
        public NotificationTypes NotificationType {get;set;}
        public int? EventNotifId {get;set;}
        [NotMapped]
        public EventNotification EventNotif {get;set;}
        public int? FriendshipNofitId {get;set;}
        [NotMapped]
        public FriendshipNotification FriendshipNotif {get;set;}
    }
}