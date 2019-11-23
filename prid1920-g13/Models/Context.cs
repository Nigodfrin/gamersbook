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
        public DbSet<Vote> Votes {get;set;}
        public DbSet<Comment> Comments {get;set;}
        public DbSet<Tag> Tags {get;set;}
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
            modelBuilder.Entity<Post>().HasData(
                new Post(){Id=1,Title="Essai",Body = "salut c'est cool",Timestamp = new DateTime(2019,10,03,11,11,11),UserId = 1},
                new Post(){Id=2,Title="Essai2",Body = "salut c'est cool2",Timestamp = new DateTime(2018,08,21,13,11,11),UserId = 1},
                new Post(){Id=3,Title=null,Body = "salut c'est cool3",Timestamp = new DateTime(2018,02,26,01,24,05),UserId =2}
            );
            modelBuilder.Entity<Vote>().HasData(
                new Vote(){UpDown= 1,Timestamp = new DateTime(2019,10,03,13,25,42),UserId = 1,PostId = 1},
                new Vote(){UpDown= 1,Timestamp = new DateTime(2019,10,03,13,45,42),UserId = 2,PostId = 1},
                new Vote(){UpDown= 1,Timestamp = new DateTime(2019,05,03,13,55,42),UserId = 1,PostId = 2},
                new Vote(){UpDown= -1,Timestamp = new DateTime(2019,01,03,13,25,42),UserId = 1,PostId = 3}
            );
        }
    }
}