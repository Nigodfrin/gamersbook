using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace prid_1819_g13.Models
{
    public static class DTOMappers
    {
        public static UserDTO ToDTO(this User user)
        {
            return new UserDTO
            {
                Pseudo = user.Pseudo,
                // we don't put the password in the DTO for security reasons
                LastName = user.LastName,
                BirthDate = user.BirthDate,
                FirstName = user.FirstName,
                Email = user.Email,
                Reputation = user.Reputation,
                Id = user.Id,
                Role = user.Role,
                Token = user.Token,
                PicturePath = user.PicturePath,
                Games = user.Games.GamesToDTO(),
                Discussions = user.Discussions.DiscussionToDTO()
            };
        }
        public static DiscussionDTO DiscussionToDTO(this Discussion discussion)
        {
            return new DiscussionDTO
            {
                Id = discussion.Id,
                Participants = discussion.Participants.Select(u => u.Pseudo).ToList(),
                Messages = discussion.Messages.MessageToDTO()
            };
        }
        public static List<DiscussionDTO> DiscussionToDTO(this IEnumerable<Discussion> discussion)
        {
            return discussion.Select(c => c.DiscussionToDTO()).ToList();
        }
        public static MessageDTO MessageToDTO(this Message message)
        {
            return new MessageDTO
            {
                MessageText = message.MessageText,
                Sender = message.Sender,
                Receiver = message.Receiver,
            };
        }
        public static List<MessageDTO> MessageToDTO(this IEnumerable<Message> message)
        {
            return message.Select(c => c.MessageToDTO()).ToList();
        }
        public static List<UserDTO> ToDTO(this IEnumerable<User> members)
        {
            return members.Select(m => m.ToDTO()).ToList();
        }
        public static PostQuestionDTO PostQuestToDTO(this Post post)
        {
            return new PostQuestionDTO
            {
                Id = post.Id,
                Title = post.Title,
                Body = post.Body,
                Timestamp = post.Timestamp,
                Score = post.Score,
                User = post.User.ToDTO(),
                Reponses = post.Reponses.OrderByDescending(p => p.Id == post.AcceptedPostId).ThenByDescending(p => p.Score).ThenByDescending(p => p.Timestamp).PostRepToDTO(),
                Tags = post.Tags.ToDTO(),
                Comments = post.Comments?.ToDTO().OrderByDescending(p => p.Timestamp).ToList(),
                Votes = post.Votes?.ToDTO(),
                AcceptedRepId = post.AcceptedPostId,
                MaxScore = post.MaxScore,
                NumUp = post.NumUp,
                NumDown = post.NumDown,
            };

        }
        public static List<PostQuestionDTO> PostQuestToDTO(this IEnumerable<Post> posts)
        {
            return posts.Select(p => p.PostQuestToDTO()).ToList();
        }
        public static PostReponseDTO PostRepToDTO(this Post post)
        {
            return new PostReponseDTO
            {
                Id = post.Id,
                Body = post.Body,
                Timestamp = post.Timestamp,
                User = post.User.ToDTO(),
                Score = post.Score,
                Votes = post.Votes?.ToDTO(),
                Comments = post.Comments?.OrderByDescending(p => p.Timestamp).ToDTO(),
                ParentId = post.ParentId,
                NumUp = post.NumUp,
                NumDown = post.NumDown,
            };
        }
        public static List<PostReponseDTO> PostRepToDTO(this IEnumerable<Post> posts)
        {
            return posts.Select(p => p.PostRepToDTO()).ToList();
        }
        public static TagDTO ToDTO(this Tag tag)
        {
            return new TagDTO
            {
                Id = tag.Id,
                Name = tag.Name,
                num = tag.num
            };
        }
        public static List<TagDTO> ToDTO(this IEnumerable<Tag> tags)
        {
            return tags.Select(t => t.ToDTO()).ToList();
        }
        public static PostTagDTO ToDTO(this PostTag postTag)
        {
            return new PostTagDTO
            {
                PostId = postTag.PostId,
                TagId = postTag.TagId
            };
        }
        public static VoteDTO ToDTO(this Vote vote)
        {
            return new VoteDTO
            {
                UpDown = vote.UpDown,
                AuthorId = vote.AuthorId,
                PostId = vote.PostId
            };
        }
        public static List<VoteDTO> ToDTO(this IEnumerable<Vote> votes)
        {
            return votes.Select(c => c.ToDTO()).ToList();
        }
        public static CommentDTO ToDTO(this Comment reccord)
        {
            return new CommentDTO
            {
                Id = reccord.Id,
                Body = reccord.Body,
                Timestamp = reccord.Timestamp,
                Author = reccord.User.ToDTO(),
                PostId = reccord.PostId
            };
        }
        public static List<CommentDTO> ToDTO(this IEnumerable<Comment> comments)
        {
            return comments.Select(c => c.ToDTO()).ToList();
        }
        public static GameDTO GameToDTO(this Game game)
        {
            return new GameDTO
            {
                Id = game.Id,
                Name = game.Name,
                Expected_release_day = game.Expected_release_day,
                Expected_release_month = game.Expected_release_month,
                Expected_release_year = game.Expected_release_year,
                Deck = game.Deck,
                Image = game.Image,
                Platforms = game.Platforms
            };
        }
        public static List<GameDTO> GamesToDTO(this IEnumerable<Game> games)
        {
            return games.Select(c => c.GameToDTO()).ToList();
        }
        public static NotificationDTO NotificationToDTO(this Notification notif)
        {
            return new NotificationDTO
            {
                CreatedOn = notif.CreatedOn,
                EventId = notif.EventId,
                Evenement = notif.Event != null ? notif.Event.EventToDTO() : null,
                NotificationType = notif.NotificationType,
                See = notif.See,
                ReceiverId = notif.ReceiverId,
                Receiver = notif.Receiver.ToDTO(),
                SenderId = notif.SenderId,
                Sender = notif.Sender.ToDTO(),
                Id = notif.Id
            };
        }
        public static List<NotificationDTO> NotificationsToDTO(this IEnumerable<Notification> notifs)
        {
            return notifs.Select(c => c.NotificationToDTO()).ToList();
        }

        public static EventDTO EventToDTO(this Event ev)
        {
            return new EventDTO
            {
                CreatedByUserId = ev.CreatedByUserId,
                Name = ev.Name,
                AccessType = ev.AccessType,
                Description = ev.Description,
                End_date = ev.End_date,
                Game = ev.Game.GameToDTO(),
                Id = ev.Id,
                Langue = ev.Langue,
                NbUsers = ev.NbUsers,
                Start_date = ev.Start_date,
                GameId = ev.GameId,
                Participants = ev.UserEvents.Select(ue => ue.User).ToDTO(),
            };
        }
        public static List<EventDTO> EventsToDTO(this IEnumerable<Event> events)
        {
            return events.Select(c => c.EventToDTO()).ToList();
        }
    }
}