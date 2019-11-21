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
        public DbSet<Post> Posts {get;set;}
        public DbSet<Post> Votes {get;set;}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
            .HasIndex(u => u.Pseudo)
            .IsUnique();
            modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            modelBuilder.Entity<Vote>().HasKey(vote => new {vote.UserId, vote.PostId});
            modelBuilder.Entity<User>().HasData(
                new User() { Id = 1, Pseudo = "Nico", Password = "123", Role = Role.Member,BirthDate = new DateTime(1994,11,02), LastName = "Godfrin", FirstName = "Nicolas", Reputation = 5, Email = "nicolas.godfrin@live.be" },
                new User() { Id = 2, Pseudo = "Raph", Password = "123", Role = Role.Member,BirthDate = new DateTime(1995,09,11), LastName = "Costa", FirstName = "Raphael", Reputation = 2, Email = "raphCosta@hotmail.com" },
                new User() { Id = 3, Pseudo = "admin", Password = "admin", Role = Role.Admin, BirthDate = new DateTime(1989,03,28),LastName = "admin", FirstName = "admin", Reputation = 5, Email = "admin@hotmail.com" }
            );
        }
    }
}