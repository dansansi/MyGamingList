using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyGamingListAPI.Models;

namespace MyGamingListAPI.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Game> Games { get; set; }
        public DbSet<UserGames> UserGames { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserGames>().HasKey(ug => new { ug.UserId, ug.GameId });

            builder.Entity<UserGames>()
                .HasOne(ug => ug.User)
                .WithMany(u => u.UserGames)
                .HasForeignKey(ug => ug.UserId);

            builder.Entity<UserGames>()
                .HasOne(ug => ug.Game)
                .WithMany(g => g.UserGames)
                .HasForeignKey(ug => ug.GameId);

            builder.Entity<Game>()
                .HasIndex(g => g.ExternalID)
                .IsUnique();

            builder.Entity<Game>()
                .Property(g => g.Rating)
                .HasPrecision(3, 2);
        }
    }
}
