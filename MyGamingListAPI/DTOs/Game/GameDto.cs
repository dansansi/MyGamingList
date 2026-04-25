namespace MyGamingListAPI.DTOs.Game
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateOnly ReleaseDate { get; set; }
        public bool ToBeAnnounced { get; set; }
        public string? BackgroundImage { get; set; }
        public decimal? Rating {  get; set; }
    }
}
