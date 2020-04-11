using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace prid_1819_g13
{
    public class NotificationNeo4J
    {
        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }
        [JsonProperty(PropertyName= "from")]
        public string SenderPseudo {get;set;}
        [JsonProperty(PropertyName= "see")]
        public Boolean See {get;set;}
    }
}