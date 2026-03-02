namespace MyGamingListAPI.DTOs.Game
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public bool ToBeAnnounced { get; set; }
        public string? BackgroundImage { get; set; }
        public decimal? Rating {  get; set; }
        
        //To-do
        //public List<PlatformsDto> Platforms { get; set; } = new();
    }

    //To-do
    //public class PlatformsDto
    //{
    //    public int Id { get; set; }
    //    public string Name { get; set; }
    //}
}
