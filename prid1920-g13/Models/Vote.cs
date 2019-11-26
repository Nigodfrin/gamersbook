using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace prid_1819_g13.Models
{
    public class Vote : IValidatableObject {
        [Required(ErrorMessage = "Required")]
        public int UpDown {get; set;}
        public int UserId {get;set;}
        public int PostId {get;set;}
        [NotMapped]
        public User User {get;set;}
        [NotMapped]
        public Post Post {get;set;}

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var currContext = validationContext.GetService(typeof(DbContext));
            Debug.Assert(currContext != null);
            if(UpDown != -1 || UpDown != 1){
                yield return new ValidationResult("UpDown ne peut être égal que à 1 ou -1", new[] { nameof(UpDown) });
            }
        }
    }
}