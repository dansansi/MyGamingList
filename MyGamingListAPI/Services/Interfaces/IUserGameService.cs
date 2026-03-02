using MyGamingListAPI.DTOs.UserGame;

namespace MyGamingListAPI.Services.Interfaces
{
    public interface IUserGameService
    {
        Task<UserGameResponseDto> AddOrUpdateGameOnListAsync(string userId, UserGameRequestDto dto);
        Task<IEnumerable<UserGameResponseDto>> GetAllUserGamesAsync(string userId);
        Task<bool> RemoveGameFromUserListAsync(string userId, int externalId);
    }
}