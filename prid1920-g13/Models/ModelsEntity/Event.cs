using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace prid_1819_g13.Models
{
public enum AccessType
{
    Public,
    Friends,
    ParticularFriend
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
        public AccessType AccessType { get; set;}
        public int CreatedByUserId { get; set;}
        public User CreatedByUser {get;set;}
        [NotMapped]
        public IList<User> Participants {get;set;}
        public int GameId {get;set;}
        [NotMapped]
        public Game Game {get;set;}
    }
}