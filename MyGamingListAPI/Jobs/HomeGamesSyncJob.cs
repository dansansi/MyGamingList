using MyGamingListAPI.Services.Implementations;
using MyGamingListAPI.Services.Interfaces;

namespace MyGamingListAPI.Jobs
{
    public class HomeGamesSyncJob(IServiceScopeFactory scopeFactory, ILogger<HomeGamesSyncJob> logger) : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
        private readonly ILogger _logger = logger;
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Iniciando busca de jogos da upcoming e HotRelease");
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var homeGamesService = scope.ServiceProvider.GetRequiredService<IHomeGamesService>();
                    await homeGamesService.SyncHomeGamesToDbAsync(stoppingToken);

                    _logger.LogInformation("Busca concluida");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao buscar upcoming e HotRelease");
                    throw;
                }

                await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
            }
        }

    }
}
