namespace MyGamingListAPI.Models
{
    public class UserGames
    {
        public string UserId { get; set; } = null!;
        public AppUser User { get; set; } = null!;
        public int GameId { get; set; }
        public Game Game { get; set; } = null!;
        public GameStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum GameStatus
    {
        Wishlist = 0,
        Playing = 1,
        Completed = 2,
        Paused = 3,
        Dropped = 4
    };
}
