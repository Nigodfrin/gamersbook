using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
    public class Message
    {
        [Key]
        public int Id {get;set;}
        public int DiscussionId {get;set;}
        [NotMapped]
        public virtual Discussion Discussion {get;set;}
        public int Sender {get;set;}
        public int Receiver {get;set;}
        [Required(ErrorMessage = "Message text can not be empty")]
        public string MessageText { get; set; }
        public DateTime Date {get;set;} = DateTime.Now;


    }
}