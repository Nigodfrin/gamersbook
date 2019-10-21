using System.ComponentModel.DataAnnotations;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_1819_g13.Models
{
    public enum Role
    {
        Admin = 2, Manager = 1, Member = 0
    }
    public class User
    {
        [Key]
        public int Id { get; set; }
        [StringLength(10, MinimumLength = 3, ErrorMessage = "Pseudo Should be minimum 3 characters and a maximum of 10 characters")]
        [Required(ErrorMessage = "Required")]
        [RegularExpression(@"^[a-zA-Z0-9\_]+$", ErrorMessage = "Pseudo can contain only letters, numbers or underscore")]
        public string Pseudo { get; set; }
        [Required(ErrorMessage = "Requiered")]
        [StringLength(10, MinimumLength = 3, ErrorMessage = "Password Should be minimum 3 characters and a maximum of 10 characters")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Requiered")]
        [EmailAddress(ErrorMessage = "Email is not valid")]
        public string Email { get; set; }
        [StringLength(50, MinimumLength = 3, ErrorMessage = "LastName Should be minimum 3 characters and a maximum of 50 characters")]
        public string LastName { get; set; }
        [StringLength(50, MinimumLength = 3, ErrorMessage = "FirstName Should be minimum 3 characters and a maximum of 50 characters")]
        public string FirstName { get; set; }
        public DateTime? BirthDate { get; set; }
        [Required(ErrorMessage = "Requiered")]
        public int Reputation { get; set; }
        public Role Role { get; set; } = Role.Member;
        [NotMapped]
        public string Token { get; set; }
    }
}