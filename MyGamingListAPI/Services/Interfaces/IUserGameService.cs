using MyGamingListAPI.DTOs.UserGame;

namespace MyGamingListAPI.Services.Interfaces
{
    public interface IUserGameService
    {
        Task<UserGameResponseDto> AddOrUpdateAsync(string userId, UserGameRequestDto dto);
        Task<IEnumerable<UserGameResponseDto>> GetAllUserGamesAsync(string userId);
        Task<bool> RemoveAsync (string userId, string externalId);
    }
}
