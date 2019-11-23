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
        public static PostDTO ToDTO(this Post post) {
            return new PostDTO {
                Id = post.Id,
                Title = post.Title,
                Body = post.Body,
                Timestamp = post.Timestamp,
                UserId = post.UserId
            };
        }
        public static TagDTO ToDTO(this Tag tag){
            return new TagDTO{
                Id = tag.Id,
                Name = tag.Name
            };
        }
        public static CommentDTO ToDTO(this Comment comment){
            return new CommentDTO{
                Id = comment.Id,
                Body = comment.Body,
                Timestamp = comment.Timestamp
            };
        }
        public static List<UserDTO> ToDTO(this IEnumerable<User> members) {
            return members.Select(m => m.ToDTO()).ToList();
        }
        public static List<PostDTO> ToDTO(this IEnumerable<Post> posts) {
            return posts.Select(p => p.ToDTO()).ToList();
        }
        public static List<TagDTO> ToDTO(this IEnumerable<Tag> tags){
            return tags.Select(t =>t.ToDTO()).ToList();
        }
         public static List<CommentDTO> ToDTO(this IEnumerable<Comment> comments) {
            return comments.Select(c => c.ToDTO()).ToList();
        }
    }
}