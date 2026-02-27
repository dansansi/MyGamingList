using MyGamingListAPI.Models;

namespace MyGamingListAPI.DTOs.UserGame
{
    public class UserGameRequestDto
    {
        public int ExternalId { get; set; }
        public GameStatus Status { get; set; }
        public bool IsFavorite { get; set; } = false;
    }
}
