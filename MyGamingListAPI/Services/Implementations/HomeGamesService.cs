using MyGamingListAPI.Data;
using MyGamingListAPI.Services.Interfaces;
using MyGamingListAPI.Models;
using Microsoft.EntityFrameworkCore;
using MyGamingListAPI.DTOs.HomeGames;
using static MyGamingListAPI.Models.HomeGames;

namespace MyGamingListAPI.Services.Implementations
{
    public class HomeGamesService(AppDbContext context, IRawgApiService rawgApiService, ILogger<HomeGamesService> logger) : IHomeGamesService
    {
        private readonly AppDbContext _context = context;
        private readonly IRawgApiService _rawgApiService = rawgApiService;
        private readonly ILogger<HomeGamesService> _logger = logger;

        public async Task SyncHomeGamesToDbAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var upcomingTask = _rawgApiService.GetUpcomingGamesAsync(cancellationToken);
                var hotReleasesTask = _rawgApiService.GetHotReleasesAsync(cancellationToken);

                await Task.WhenAll(upcomingTask, hotReleasesTask);

                await _context.HomeGames.ExecuteDeleteAsync(cancellationToken);

                var upcoming = upcomingTask.Result.Select(g => new HomeGames
                {
                    ExternalId = g.Id,
                    Name = g.Name,
                    BackgroundImage = g.Background_Image,
                    Released = g.Released,
                    Type = HomeGameType.Upcoming,
                    LastUpdated = DateTime.UtcNow
                });

                var hotReleases = hotReleasesTask.Result.Select(g => new HomeGames
                {
                    ExternalId = g.Id,
                    Name = g.Name,
                    BackgroundImage = g.Background_Image,
                    Released = g.Released,
                    Type = HomeGameType.HotRelease,
                    LastUpdated = DateTime.UtcNow
                });

                _context.AddRange(upcoming);
                _context.AddRange(hotReleases);
                await _context.SaveChangesAsync(cancellationToken);

                _logger.LogInformation("Concluida atualização de jogos da Home");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao lidar com upcoming e/ou hotReleases.");
            }
        }

        public async Task<HomeGamesReleasesDto> GetNewHomeGamesAsync()
        {
            try
            {
                var homeGames = await _context.HomeGames.ToListAsync();
                var upcoming = homeGames.Where(g => g.Type == HomeGameType.Upcoming).Select(g => new HomeGamesDto
                {
                    ExternalId = g.ExternalId,
                    Name = g.Name,
                    ReleaseDate = g.Released,
                    BackgroundImage = g.BackgroundImage
                }).ToList();

                var hotReleases = homeGames.
                    Where(g => g.Type == HomeGameType.HotRelease).
                    Select(g => new HomeGamesDto
                {
                    ExternalId = g.ExternalId,
                    Name = g.Name,
                    ReleaseDate = g.Released,
                    BackgroundImage = g.BackgroundImage
                }).ToList();

                _logger.LogInformation("Busca do upcoming com sucesso.");
                return new HomeGamesReleasesDto 
                {
                    Upcoming = upcoming,
                    HotReleases = hotReleases 
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar upcoming do banco de dados.");
                throw;
            }
        }
        public async Task<List<HomeGamesDto>> GetRandomHomeGamesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var games = await _rawgApiService.GetRandomGamesFromApiAsync(cancellationToken);
                return games.Select(g => new HomeGamesDto
                {
                    ExternalId = g.Id,
                    Name = g.Name,
                    BackgroundImage = g.Background_Image,
                    ReleaseDate = g.Released,
                    Rating = g.Rating,
                    RatingsCount = g.Ratings_Count
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogos aleatórios pra home");
                throw;
            }
        }
    }
}
