using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid_1819_g13.Models
{
    public enum Role
    {
        Admin = 2, Member = 1, Visitor = 0
    }
    public class User : IValidatableObject
    {
        [Key]
        public int Id { get; set; }
        [StringLength(10, MinimumLength = 3, ErrorMessage = "Pseudo Should be minimum 3 characters and a maximum of 10 characters")]
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[a-zA-Z][a-zA-Z0-9_]*", ErrorMessage = "Pseudo can contain only letters, numbers or underscore")]
        public string Pseudo { get; set; }
        [Required(ErrorMessage = "Requiered")]
        public string Password { get; set; }
        public string PicturePath { get; set; }
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
        [NotMapped]
        public virtual IList<Vote> Votes { get; set; }
        [NotMapped]
        public virtual IList<Post> Posts { get; set; }
        [NotMapped]
        public virtual IList<Comment> Comments { get; set; }
        [NotMapped]
        public virtual IList<UserGames> UserGames { get; set; } = new List<UserGames>();
        [NotMapped]
        public IEnumerable<Game> Games
        {
            get => UserGames.Select(g => g.ownedGame);
        }
        [NotMapped]
        public virtual IList<UserDiscussion> UserDiscussions { get; set; } = new List<UserDiscussion>();
        [NotMapped]
        public IEnumerable<Discussion> Discussions
        {
            get => UserDiscussions.Select(g => g.ownedDiscussion);
        }

        [NotMapped]
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