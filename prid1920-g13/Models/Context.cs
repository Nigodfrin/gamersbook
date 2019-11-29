using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
using System.Security.Claims;
//using prid1920_tuto.Helpers;
using System;
using PRID_Framework;

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

            modelBuilder.Entity<Comment>()
            .HasOne<User>(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
            .HasOne<Post>(c => c.Post)                  // définit la propriété de navigation pour le côté (1) de la relation
            .WithMany(p => p.Comments)            // définit la propriété de navigation pour le côté (N) de la relation
            .HasForeignKey(c => c.PostId)         // spécifie que la clé étrangère est Comment.PostId
            .OnDelete(DeleteBehavior.Restrict);   // spécifie le comportement en cas de delete : ici, un refus

            modelBuilder.Entity<Vote>()
            .HasOne<Post>(p => p.Post)
            .WithMany(p => p.Votes)
            .HasForeignKey(p => p.PostId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vote>()
            .HasOne<User>(v => v.User)
            .WithMany(u => u.Votes)
            .HasForeignKey(v => v.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Post>()
            .HasOne(u => u.User)
            .WithMany(p => p.Posts)
            .HasForeignKey(p => p.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PostTag>()
            .HasOne<Post>(pt => pt.Post)
            .WithMany(p => p.PostTags)
            .HasForeignKey(pt => pt.PostId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PostTag>()
            .HasOne<Tag>(pt => pt.Tag)
            .WithMany(t => t.PostTags)
            .HasForeignKey(pt => pt.TagId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Post>()
            .HasOne(u => u.ParentPost)
            .WithMany(p => p.Posts)
            .HasForeignKey(p => p.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        }
    }
}