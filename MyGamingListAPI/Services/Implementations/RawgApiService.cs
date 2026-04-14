using MyGamingListAPI.DTOs.RawgApi;
using MyGamingListAPI.Services.Interfaces;

namespace MyGamingListAPI.Services.Implementations
{
    public class RawgApiService (IConfiguration configuration, HttpClient httpClient, ILogger<RawgApiService> logger) : IRawgApiService
    { 
        private readonly HttpClient _httpClient = httpClient;
        private readonly string _apiKey = configuration["Rawg:ApiKey"]!;
        private readonly ILogger _logger = logger;

        public async Task<List<RawgGameDto>> SearchGamesAsync (string query, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
        {
            try
            {
                var url = $"games?key={_apiKey}&search={query}&page={page}&page_size={pageSize}";
                var response = await _httpClient.GetFromJsonAsync<RawgGameResponseDto>(url, cancellationToken);

                return response?.Results ?? new List<RawgGameDto>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogos");
                throw;
            }
        }

        public async Task<RawgGameDto?> SearchGameByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            try
            {
                var url = $"games/{id}?key={_apiKey}";

                var response = await _httpClient.GetFromJsonAsync<RawgGameDto>(url, cancellationToken);

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogo da Api Externa {Id}", id);
                throw;
            }
        }

        public async Task<List<RawgGameDto>> GetUpcomingGamesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var tomorrow = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd");
                var futureDate = DateTime.UtcNow.AddMonths(1).ToString("yyyy-MM-dd");

                var upcomingUrl = $"games?key={_apiKey}&dates={tomorrow},{futureDate}&ordering=released&page-size=20";
                var upcoming =  await _httpClient.GetFromJsonAsync<RawgGameResponseDto>(upcomingUrl, cancellationToken);

                return upcoming!.Results ?? new List<RawgGameDto>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogos upcoming pra home");
                throw;
            }
        }

        public async Task<List<RawgGameDto>> GetHotReleasesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
                var pastDate = DateTime.UtcNow.AddMonths(-1).ToString("yyyy-MM-dd");

                var hotReleasesUrl = $"games?key={_apiKey}&dates={pastDate},{today}&ordering=-released&page-size=20";

                var hotReleases = await _httpClient.GetFromJsonAsync<RawgGameResponseDto>(hotReleasesUrl, cancellationToken);

                return hotReleases!.Results?? new List<RawgGameDto>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogos pra home");
                throw;
            }
        }

        public async Task<List<RawgGameDto>> GetRandomGamesFromApiAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var randomPage = new Random().Next(1, 11);
                var url = $"games?key={_apiKey}" +
                          $"&dates=1993-01-01,{DateTime.UtcNow:yyyy-MM-dd}" +
                          $"&platforms=1,4,7,8,9,10,11,14,15,16,18,27,49,74,79,80,83,105,106,107,167,186,187" +
                          $"&ratings_count=10" +
                          $"&page_size=40" +
                          $"&page={randomPage}" +
                          $"&ordering=-rating";

                var response = await _httpClient.GetFromJsonAsync<RawgGameResponseDto>(url, cancellationToken);
                return response?.Results ?? new List<RawgGameDto>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogos aleatórios da RAWG");
                throw;
            }
        }
    }
}