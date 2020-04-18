using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace prid_1819_g13.Models
{
public enum EventsType
{
    Public,
    Friends,
    ParticularFriend
}
    public class EventsGame
    {
        [JsonProperty(PropertyName = "uuid")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "description")]
        public string Description { get; set; }
        [JsonProperty(PropertyName = "start_date")]
        public DateTime Start_date {get;set;}
        [JsonProperty(PropertyName = "end_date")]
        public DateTime End_date {get;set;}
        [JsonProperty(PropertyName = "langue")]
        public string Langue {get;set;}
        [JsonProperty(PropertyName = "nbUsers")]
        public int NbUsers{ get; set; }
        [JsonProperty(PropertyName = "eventType")]
        public string EventType { get; set;}
        [JsonProperty(PropertyName = "createdBy")]
        public string CreatedBy { get; set;}

    }
}