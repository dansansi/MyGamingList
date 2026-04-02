using MyGamingListAPI.Models;

namespace MyGamingListAPI.DTOs.UserGame
{
    public class UserGameStatusResponseDto
    {
        public GameStatus? Status { get; set; }
        public bool? Favorite { get; set; }
    }
}
