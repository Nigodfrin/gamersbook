using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
    public class NotificationDTO
    {
        public int SenderId {get;set;}
        public int ReceiverId {get;set;}
        public int? EventId {get;set;}
        public bool See {get;set;} = false;
        public virtual NotificationTypes NotificationType {get;set;}
        public DateTime CreatedOn {get;set;} = DateTime.Now;
    }
}