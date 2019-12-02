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
        public static PostQuestionDTO PostQuestToDTO(this Post post) {
            return new PostQuestionDTO {
                Id = post.Id,
                Title = post.Title,
                Body = post.Body,
                Timestamp = post.Timestamp,
                Score = post.Score,
                User = post.User.ToDTO(),
                Reponses = post.Reponses.PostRepToDTO(),
                Tags = post.Tags?.ToDTO(),
                Comments = post.Comments?.ToDTO(),
                Votes = post.Votes?.ToDTO(),
                AcceptedRepId = post.AcceptedPostId
            };
            
        }
        public static List<PostQuestionDTO> PostQuestToDTO(this IEnumerable<Post> posts) {
            return posts.Select(p => p.PostQuestToDTO()).ToList();
        }
        public static PostReponseDTO PostRepToDTO(this Post post) {
            return new PostReponseDTO {
                Id = post.Id,
                Body = post.Body,
                Timestamp = post.Timestamp,
                Author = post.User.ToDTO(),
                Score = post.Score,
                Votes = post.Votes?.ToDTO(),
                Comments = post.Comments?.ToDTO()
            };
        }
        public static List<PostReponseDTO> PostRepToDTO(this IEnumerable<Post> posts) {
            return posts.Select(p => p.PostRepToDTO()).ToList();
        }
        public static TagDTO ToDTO(this Tag tag){
            return new TagDTO{
                Id = tag.Id,
                Name = tag.Name
            };
        }
        public static List<TagDTO> ToDTO(this IEnumerable<Tag> tags){
            return tags.Select(t =>t.ToDTO()).ToList();
        }
        public static VoteDTO ToDTO(this Vote vote){
            return new VoteDTO{
                UpDown = vote.UpDown
            };
        }
        public static List<VoteDTO> ToDTO(this IEnumerable<Vote> votes) {
            return votes.Select(c => c.ToDTO()).ToList();
        }
        public static CommentDTO ToDTO(this Comment comment){
            return new CommentDTO{
                Id = comment.Id,
                Body = comment.Body,
                Timestamp = comment.Timestamp,
                Author = comment.User.ToDTO()
                
            };
        }
         public static List<CommentDTO> ToDTO(this IEnumerable<Comment> comments) {
            return comments.Select(c => c.ToDTO()).ToList();
        }
    }
}