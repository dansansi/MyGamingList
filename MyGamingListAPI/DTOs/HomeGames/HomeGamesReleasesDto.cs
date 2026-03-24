namespace MyGamingListAPI.DTOs.HomeGames
{
    public class HomeGamesReleasesDto
    {
        public List<HomeGamesDto> Upcoming { get; set; } = new();
        public List<HomeGamesDto> HotReleases { get; set; } = new();
    }
}
