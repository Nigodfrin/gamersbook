using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;
using prid_1819_g13.Models;
namespace prid_1819_g13
{
    public class DiscussionDTO
    {
        public int Id {get;set;}
        
        public IList<MessageDTO> Messages {get;set;}

        public IList<string> Participants {get;set;}
    }
}