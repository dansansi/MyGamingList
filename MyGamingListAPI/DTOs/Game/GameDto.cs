namespace MyGamingListAPI.DTOs.Game
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public bool ToBeAnnounced { get; set; }
        public string BackgroundImage { get; set; }
        public decimal? Rating {  get; set; }
        public List<PlatformsDto> Platforms { get; set; } = new();
    }

    public class PlatformsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
