using MyGamingListAPI.DTOs.HomeGames;

namespace MyGamingListAPI.Services.Interfaces
{
    public interface IHomeGamesService
    {
        public Task SyncHomeGamesAsync(CancellationToken cancellationToken = default);
        public Task<HomeGamesReleasesDto> GetHomeGamesAsync();
    }
}