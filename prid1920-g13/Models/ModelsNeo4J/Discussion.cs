using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
    public class Discussion
    {
        [JsonProperty(PropertyName = "participants")]
        public List<User> Participants {get;set;}
        [JsonProperty(PropertyName = "messageList")]
        public List<Message> MessageList { get; set; }

    }
}