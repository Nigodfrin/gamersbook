using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace prid_1819_g13.Models {
    public static class DTOMappers {
        public static UserDTO ToDTO(this User user) {
            return new UserDTO {
                Pseudo = user.Pseudo,
                // we don't put the password in the DTO for security reasons
                LastName = user.LastName,
                BirthDate = user.BirthDate,
                FirstName = user.FirstName,
                Email = user.Email,
                Reputation = user.Reputation,
                Id = user.Id,
                Role = user.Role,
            };
        }
        public static List<UserDTO> ToDTO(this IEnumerable<User> members) {
            return members.Select(m => m.ToDTO()).ToList();
        }
    }
}