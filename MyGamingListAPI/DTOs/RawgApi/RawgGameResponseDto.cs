namespace MyGamingListAPI.DTOs.RawgApi
{
    public class RawgGameResponseDto
    {
        public List<RawgGameResponseDto> Result { get; set; }
    }

    public class RawgGameDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Released { get; set; }
        public string Background_Image { get; set; }
        public decimal Rating { get; set; }

    }
}
