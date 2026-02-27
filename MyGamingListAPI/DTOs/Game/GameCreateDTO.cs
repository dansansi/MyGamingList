namespace MyGamingListAPI.DTOs.Game
{
    public class GameCreateDto
    {
        public int ExternalId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string Slug { get; set; } = null!;
        public string BackgroundImage { get; set; } = null!;
        public DateTime? ReleaseDate { get; set; }
        public bool Tba {  get; set; }
        public decimal? Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
