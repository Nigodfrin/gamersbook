using System;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_1819_g13.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        [Required(ErrorMessage = "Required")]
        public string Body { get; set; }
        [Required(ErrorMessage = "Required")]
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public int AuthorId { get; set; }
        public int? ParentId { get; set; }
        public int? AcceptedPostId { get; set; }
        public User User { get; set; }
        public Post ParentPost { get; set; }
        public Post AcceptedPost { get; set; }
        public IList<Vote> Votes { get; set; }
        public IList<Post> Reponses { get; set; }
        public IList<Comment> Comments { get; set; }
        [NotMapped]
        public IEnumerable<Tag> Tags
        {
            get => PostTags.Select(f => f.Tag);
        }
        [NotMapped]
        public ICollection<Post> Posts
        {
            get => PostTags.Select(f => f.Post).ToList();
        }
        public List<PostTag> PostTags { get; set; } = new List<PostTag>();

    }
}