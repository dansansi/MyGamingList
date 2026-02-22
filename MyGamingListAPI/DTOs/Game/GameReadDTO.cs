namespace MyGamingListAPI.DTOs.Game
{
    public class GameReadDto
    {
        public int Id { get; set; }
        public int ExternalId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public bool Tba { get; set; }
        public string? BackgroundImage { get; set; }
        public decimal? Rating { get; set; }
    }
}