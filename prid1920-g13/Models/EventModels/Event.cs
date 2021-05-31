using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace prid_1819_g13.Models
{
public enum AccessType
{
    Public,
    Friends,
    Private
}
    public class Event
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Start_date {get;set;}
        public DateTime End_date {get;set;}
        public string Langue {get;set;}
        public int NbUsers{ get; set; }
        public virtual AccessType AccessType { get; set;}
        public int CreatedByUserId { get; set;}
        public virtual ICollection<UserEvent> UserEvents {get;set;} = new List<UserEvent>();
        public virtual ICollection<Notification> Notifs {get;set;} = new List<Notification>();
        [NotMapped]
        public IEnumerable<User> Participants
        {
            get => UserEvents.Select(ue => ue.User);
        }
        public int GameId {get;set;}
        public virtual Game Game {get;set;}
    }
}