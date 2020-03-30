using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
    public class Message
    {
        [JsonProperty(PropertyName = "sender")]
        public string SenderPseudo {get;set;}
        [JsonProperty(PropertyName = "messageText")]
        public string MessageText { get; set; }
        [JsonProperty(PropertyName = "receiver")]
        public string ReceiverPseudo {get;set;}


    }
}