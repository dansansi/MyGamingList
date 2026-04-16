using MyGamingListAPI.DTOs.HomeGames;

namespace MyGamingListAPI.Services.Interfaces
{
    public interface IHomeGamesService
    {
        public Task SyncHomeGamesToDbAsync(CancellationToken cancellationToken = default);
        public Task<HomeGamesReleasesDto> GetNewHomeGamesAsync();

        public Task<List<HomeGamesDto>> GetRandomHomeGamesAsync(CancellationToken cancellationToken = default);
    }
}