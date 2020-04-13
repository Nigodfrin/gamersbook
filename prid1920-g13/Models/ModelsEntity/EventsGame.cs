using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace prid_1819_g13.Models
{
public enum EventsType
{
    Public,
    AllFriends,
    SelectedFriendsOrGroups
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
        public string Start_date {get;set;}
        [JsonProperty(PropertyName = "end_date")]
        public string End_date {get;set;}
        [JsonProperty(PropertyName = "langue")]
        public string Langue {get;set;}
        [JsonProperty(PropertyName = "nbUsers")]
        public string NbUsers{ get; set; }
        [JsonProperty(PropertyName = "eventType")]
        public string EventType { get; set;}

    }
}