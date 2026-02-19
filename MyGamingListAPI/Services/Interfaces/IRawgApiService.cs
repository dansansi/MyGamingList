using MyGamingListAPI.DTOs.RawgApi;

namespace MyGamingListAPI.Services.Interfaces
{
    public interface IRawgApiService
    {
        Task<List<RawgGameDto>> SearchGamesAsync(string query, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default);
        Task<RawgGameDto?> SearchGameByIdAsync(int id, CancellationToken cancellationToken = default);
    }
}
