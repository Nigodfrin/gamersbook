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
                new User() { Id = 1,Pseudo = "Nico", Password = "123",Role = Role.Member, LastName = "Godfrin", FirstName="Nicolas", Reputation = 5, Email = "nicolas.godfrin@live.be" },
                new User() { Id = 2 ,Pseudo = "Raph", Password = "123",Role = Role.Member, LastName = "Costa", FirstName = "Raphael", Reputation = 2, Email = "raphCosta@hotmail.com" },
                new User() { Id = 3 ,Pseudo = "admin", Password = "admin",Role = Role.Admin, LastName = "admin", FirstName = "admin", Reputation = 5, Email = "admin@hotmail.com" }
            );
        }
    }
}