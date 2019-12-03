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
        public virtual  User User { get; set; }
        public virtual  Post ParentPost { get; set; }
        public virtual Post AcceptedPost { get; set; }
        public virtual IList<Vote> Votes { get; set; } = new List<Vote>();
        public virtual IList<Post> Reponses { get; set; } = new List<Post>();
        public virtual IList<Comment> Comments { get; set; } = new List<Comment>();
        private ICollection<Tag> tags;
        [NotMapped]
        public int Score 
        {
            get => Votes.Sum(v => v.UpDown);
        }
        public virtual ICollection<Tag> Tags
        {
            get =>PostTags.Select(f => f.Tag).ToList();
            

            set => this.Tags = value;
        }
        public virtual List<PostTag> PostTags { get; set; } = new List<PostTag>();

    }
}