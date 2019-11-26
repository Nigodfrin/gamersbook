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
            modelBuilder.Entity<User>()
            .HasIndex(u => u.Pseudo)
            .IsUnique();
            modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            modelBuilder.Entity<Vote>()
            .HasKey(vote => new { vote.UserId, vote.PostId });
            modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post)                  // définit la propriété de navigation pour le côté (1) de la relation
            .WithMany(p => p.Comments)            // définit la propriété de navigation pour le côté (N) de la relation
            .HasForeignKey(c => c.PostId)         // spécifie que la clé étrangère est Comment.PostId
            .OnDelete(DeleteBehavior.Restrict);   // spécifie le comportement en cas de delete : ici, un refus
            }
    }
}