using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
    public class NotificationDTO
    {
        public int Id {get;set;}
        public int SenderId {get;set;}
        public virtual UserDTO Sender {get;set;}
        public int ReceiverId {get;set;}
        public virtual UserDTO Receiver {get;set;}
        public int? EventId {get;set;}
        public virtual EventDTO Evenement {get;set;}
        public bool See {get;set;} = false;
        public virtual NotificationTypes NotificationType {get;set;}
        public DateTime CreatedOn {get;set;} = DateTime.Now;
    }
}