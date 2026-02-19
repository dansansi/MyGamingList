using MyGamingListAPI.DTOs.RawgApi;
using MyGamingListAPI.Services.Interfaces;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MyGamingListAPI.Services.Implementations
{
    public class RawgApiService (IConfiguration configuration, HttpClient httpClient, ILogger<RawgApiService> logger) : IRawgApiService
    { 
        private readonly HttpClient _httpClient = httpClient;
        private readonly string _apiKey = configuration["Rawg:ApiKey"]!;
        private readonly ILogger _logger;

        public async Task<List<RawgGameDto>> SearchGamesAsync (string query, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var url = $"https://api.rawg.io/api/games?key={_apiKey}&search={query}&page={page}&page_size={pageSize}";

            var response = await _httpClient.GetFromJsonAsync<RawgGameResponseDto>(url, cancellationToken);

            return response?.Results ?? new List<RawgGameDto>();
        }

        public async Task<RawgGameDto?> SearchGameByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var url = $"https://api.rawg.io/api/games/{id}?key={_apiKey}";

            var response = await _httpClient.GetFromJsonAsync<RawgGameDto>(url, cancellationToken);

            return response;
        }
    }
}
