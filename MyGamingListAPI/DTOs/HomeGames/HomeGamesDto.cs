namespace MyGamingListAPI.DTOs.HomeGames
{
    public class HomeGamesDto
    {
        public int ExternalId { get; set; }
        public string? Name { get; set; }
        public string? BackgroundImage { get; set; }
        public decimal? Rating { get; set; }
        public int RatingsCount { get; set; }
        public DateTime? ReleaseDate {  get; set; }

    }
}
