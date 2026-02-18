using MyGamingListAPI.DTOs.RawgApi;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MyGamingListAPI.Services.Implementations
{
    public class RawgApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public RawgApiService(IConfiguration configuration, HttpClient httpClient)
        {
            _apiKey = configuration["Rawg:ApiKey"]!;
            _httpClient = httpClient;
        }

        public async Task<List<RawgGameDto>> SearchGamesAsync (string query, int page = 1, int pageSize = 10)
        {
            
            var url = $"https://api.rawg.io/api/games?key={_apiKey}&search={query}&page={page}&page_size={pageSize}";

            var response = await _httpClient.GetFromJsonAsync<RawgGameResponseDto>(url);

            return response?.Results ?? new List<RawgGameDto> ();
        }

        public async Task<RawgGameDto?> SearchGameByIdAsync(int id)
        {
            var url = $"https://api.rawg.io/api/games/{id}?key={_apiKey}";

            var response = await _httpClient.GetFromJsonAsync<RawgGameDto>(url);

            return response;
        }
    }
}
