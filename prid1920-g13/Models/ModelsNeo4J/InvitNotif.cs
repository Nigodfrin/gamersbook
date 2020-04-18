using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace prid_1819_g13
{
    public class InvitNotif
    {
        [JsonProperty(PropertyName = "notif")]
        public NotificationNeo4J Notif { get; set; }
        [JsonProperty(PropertyName = "users")]
        public List<UserNeo4J> Users { get; set; }
        
        
    }
}