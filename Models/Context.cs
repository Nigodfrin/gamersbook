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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
            .HasIndex(u => u.Pseudo)
            .IsUnique();
            modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>().HasData(
                new User() { Id = 1,Pseudo = "ben", Password = "ben", LastName = "Godfrin", FirstName="Nicolas", Reputation = 5, Email = "nicolas.godfrin@live.be" },
                new User() { Id = 2 ,Pseudo = "bruno", Password = "bruno", LastName = "Costa", FirstName = "Raphael", Reputation = 2, Email = "raphCosta@hotmail.com" }
            );
        }
    }
}