namespace MyGamingListAPI.Services.Implementations
{
    public class RawgApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public RawgApiService(HttpClient httpClient, string apiKey)
        {
            _httpClient = httpClient;
            _apiKey = apiKey;
        }
    }
}
