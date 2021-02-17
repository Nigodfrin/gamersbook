using Microsoft.EntityFrameworkCore;

namespace prid_1819_g13.Models
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<Game> Games {get;set;}
        public DbSet<UserGames> UserGames {get;set;}        
        public DbSet<Message> Messages {get;set;}
        public DbSet<Discussion> Discussions {get;set;}        
        public DbSet<Event> Events {get;set;}        
        public DbSet<Notification> Notifications {get;set;}        
        public DbSet<UserDiscussion> UserDiscussions {get;set;}        
        public DbSet<Friendship> Friendships {get;set;}        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasIndex(u => u.Pseudo).IsUnique();

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<Tag>().HasIndex(t => t.Name).IsUnique();

            modelBuilder.Entity<Vote>()
            .HasKey(vote => new { vote.AuthorId, vote.PostId });

            modelBuilder.Entity<PostTag>()
            .HasKey(t => new { t.PostId, t.TagId });

            modelBuilder.Entity<Friendship>()
            .HasKey(f => new { f.AddresseeId, f.RequesterId  });


            modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post)                  
            .WithMany(p => p.Comments)           
            .HasForeignKey(c => c.PostId)        
            .OnDelete(DeleteBehavior.Restrict); 
            
            modelBuilder.Entity<Post>()
            .HasMany(u => u.Comments)
            .WithOne(u => u.Post)
            .HasForeignKey(u => u.PostId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vote>()
            .HasOne(p => p.Post)
            .WithMany(p => p.Votes)
            .HasForeignKey(p => p.PostId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vote>()
            .HasOne(v => v.User)
            .WithMany(u => u.Votes)
            .HasForeignKey(v => v.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Post>()
            .HasOne(u => u.User)
            .WithMany(p => p.Posts)
            .HasForeignKey(p => p.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PostTag>()
            .HasOne(pt => pt.Post)
            .WithMany(p => p.PostTags)
            .HasForeignKey(pt => pt.PostId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PostTag>()
            .HasOne(pt => pt.Tag)
            .WithMany(t => t.PostTags)
            .HasForeignKey(pt => pt.TagId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Post>()
            .HasOne(u => u.ParentPost)
            .WithMany(p => p.Reponses)
            .HasForeignKey(p => p.ParentId)
            .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<UserGames>()
            .HasKey(userGame => new { userGame.UserId, userGame.GameId});
            modelBuilder.Entity<UserEvent>()
            .HasKey(userEvent => new { userEvent.UserId, userEvent.EventId});

            modelBuilder.Entity<UserGames>()
            .HasOne<User>(user => user.UserGame)
            .WithMany(u => u.UserGames)
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<UserGames>()
            .HasOne<Game>(game => game.ownedGame)
            .WithMany(u => u.UserGames)
            .HasForeignKey(u => u.GameId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserDiscussion>()
            .HasKey(ud => new { ud.UserId, ud.DiscussionId});

            modelBuilder.Entity<UserDiscussion>()
            .HasOne<User>(user => user.User)
            .WithMany(u => u.UserDiscussions)
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<UserDiscussion>()
            .HasOne<Discussion>(d => d.OwnedDiscussion)
            .WithMany(u => u.UserDiscussions)
            .HasForeignKey(u => u.DiscussionId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
            .HasOne<Discussion>(d => d.Discussion)
            .WithMany(m => m.Messages)
            .HasForeignKey(d => d.DiscussionId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserEvent>()
            .HasOne(u => u.User)
            .WithMany(ue => ue.UserEvents)
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<UserEvent>()
            .HasOne(e => e.Event)
            .WithMany(ue => ue.UserEvents)
            .HasForeignKey(u => u.EventId)
            .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Event>()
            .HasOne(e => e.Game)
            .WithMany(ue => ue.Events)
            .HasForeignKey(u => u.GameId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
            .HasOne(u => u.Receiver)
            .WithMany(u => u.Notifications)
            .HasForeignKey(u => u.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
            .HasOne(u => u.Event)
            .WithMany(u => u.Notifs)
            .HasForeignKey(u => u.EventId)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }
}