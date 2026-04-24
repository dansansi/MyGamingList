using MyGamingListAPI.Models;

namespace MyGamingListAPI.DTOs.UserGame
{
    public class UserGameResponseDto
    {
        public int ExternalId { get; set; }
        public string GameName { get; set; } = null!;
        public GameStatus? Status { get; set; }
        public bool? IsFavorite { get; set; }
        public DateOnly CreatedAt { get; set; }

        public string? BackgroundImage { get; set; }
    }
}
