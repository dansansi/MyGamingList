using Microsoft.AspNetCore.Identity;

namespace MyGamingListAPI.Models
{
    public class AppUser : IdentityUser
    {
        public ICollection<UserGames> UserGames { get; set; } = new List<UserGames>();
    }
}
