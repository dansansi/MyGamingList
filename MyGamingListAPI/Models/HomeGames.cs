namespace MyGamingListAPI.Models
{
    public class HomeGames
    {
            public int Id { get; set; }
            public int ExternalId { get; set; }
            public string? Name { get; set; }
            public string? BackgroundImage { get; set; }
            public HomeGameType Type { get; set; }
            public DateOnly? Released { get; set; }
            public DateTime LastUpdated { get; set; }
        public enum HomeGameType
        {
            Upcoming,
            HotRelease
        }
    }
}
