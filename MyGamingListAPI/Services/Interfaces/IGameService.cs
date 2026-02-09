using MyGamingListAPI.DTOs.Game;

namespace MyGamingListAPI.Services.Interfaces
{
    public interface IGameService
    {
        Task<IEnumerable<GameReadDto>> GetAllAsync();
        Task<GameReadDto?> GetByIdAsync(int id);
        Task<GameReadDto> CreateAsync(GameCreateDto dto);
        Task<GameReadDto?> UpdateAsync (int id , GameUpdateDto dto);
        Task<bool> DeleteAsync (int id);
    }
}
