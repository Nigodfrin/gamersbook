using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_1819_g13.Models
{
    public enum Role
    {
        Admin = 2, Manager = 1, Member = 0
    }
    public class User : IValidatableObject
    {
        [Key]
        public int Id { get; set; }
        [StringLength(10, MinimumLength = 3, ErrorMessage = "Pseudo Should be minimum 3 characters and a maximum of 10 characters")]
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[a-zA-Z][a-zA-Z0-9_]{2,9}$", ErrorMessage = "Pseudo can contain only letters, numbers or underscore")]
        public string Pseudo { get; set; }
        [Required(ErrorMessage = "Requiered")]
        [StringLength(10, MinimumLength = 3, ErrorMessage = "Password Should be minimum 3 characters and a maximum of 10 characters")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Requiered")]
        [EmailAddress(ErrorMessage = "Email is not valid")]
        public string Email { get; set; }
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Lastname Should be minimum 3 characters and a maximum of 50 characters")]
        public string LastName { get; set; }
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Firstname Should be minimum 3 characters and a maximum of 50 characters")]
        public string FirstName { get; set; }
        public DateTime? BirthDate { get; set; }
        [Required(ErrorMessage = "Requiered")]
        public int Reputation { get; set; }
        public Role Role { get; set; } = Role.Member;
        [NotMapped]
        public string Token { get; set; }
        public virtual ICollection<Vote> Votes {get;set;}
        public virtual ICollection<Post> Posts {get;set;}
        // public virtual ICollection<Comment> Comments {get;set;}
        public int? Age
        {
            get
            {
                if (!BirthDate.HasValue)
                    return null;
                var today = DateTime.Today;
                var age = today.Year - BirthDate.Value.Year;
                if (BirthDate.Value.Date > today.AddYears(-age)) age--;
                return age;
            }
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var currContext = validationContext.GetService(typeof(DbContext));
            Debug.Assert(currContext != null);
            if (BirthDate.HasValue && BirthDate.Value.Date > DateTime.Today)
                yield return new ValidationResult("Can't be born in the future in this reality", new[] { nameof(BirthDate) });
            else if (Age.HasValue && Age < 18)
                yield return new ValidationResult("Must be 18 years old", new[] { nameof(BirthDate) });
            if (LastName == "" && FirstName != "")
            {
                yield return new ValidationResult("First name can't exist without a Last name", new[] { nameof(FirstName) });
            }
            else if (FirstName == "" && LastName != "")
            {
                yield return new ValidationResult("Last name can't exist without a first name", new[] { nameof(LastName) });
            }
        }
    }
}