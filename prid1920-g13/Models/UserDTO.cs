using System;
namespace prid_1819_g13.Models {
    public class UserDTO {
        public int Id {get; set;}
        public string Pseudo { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Email {get; set;}
        public string FirstName {get; set;}
        public int Reputation {get; set;}
        public Role Role { get; set; }
    }
}