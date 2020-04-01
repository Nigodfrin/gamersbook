using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
    public class MessageDTO
    {
        [Key]
        public int Id {get;set;}
        public int DiscussionId {get;set;}
        public int Sender {get;set;}
        public int Receiver {get;set;}
        [Required(ErrorMessage = "Message text can not be empty")]
        public string MessageText { get; set; }
        public DateTime Date {get;set;} = DateTime.Now;


    }
}