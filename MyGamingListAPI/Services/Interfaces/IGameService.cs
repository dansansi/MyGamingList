using MyGamingListAPI.DTOs.Game;

namespace MyGamingListAPI.Services.Interfaces
{
    public interface IGameService
    {
        Task<IEnumerable<GameReadDto>> GetAllAsync();
        Task<GameReadDto?> GetOrCreateGameByIdAsync(int id);
        Task<bool> EnsureGetOrCreateGameByIdAsync(int externalId);
        Task<GameReadDto> CreateAsync(GameCreateDto dto);
        Task<GameReadDto?> UpdateAsync (int id , GameUpdateDto dto);
        Task<bool> DeleteAsync (int id);
        Task<string> GetBackgroundImageAsync();
    }
}
