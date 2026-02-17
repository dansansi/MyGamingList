namespace MyGamingListAPI.DTOs.RawgApi
{
    public class RawgGameResponseDto
    {
        public List<RawgGameDto> Results { get; set; }
    }

    public class RawgPlatformDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class RawgGameDto
    {
        public int Id { get; set; }
        public string Slug { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime Released { get; set; }
        public bool Tba {  get; set; }
        public string? Background_Image { get; set; }
        public decimal? Rating { get; set; }
        public List<RawgPlatformDto> Platforms { get; set; } = new();
    }
}