using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
    public class Discussion
    {
        [Key]
        public int Id {get;set;}
        
        public virtual IList<UserDiscussion> UserDiscussions {get;set;} = new List<UserDiscussion>();
        public virtual IList<Message> Messages {get;set;} = new List<Message>();

        [NotMapped]
        public IEnumerable<User> Participants 
        {
            get => UserDiscussions.Select(u => u.User);
        }
    }
}