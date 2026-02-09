using Microsoft.EntityFrameworkCore;

namespace MyGamingListAPI.Models
{
    public class Game
    {
        public int Id { get; set; }
        public int ExternalID { get; set; }
        public string Name { get; set; }

    }
}
