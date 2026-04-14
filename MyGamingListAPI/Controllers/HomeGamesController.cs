using Microsoft.AspNetCore.Mvc;
using MyGamingListAPI.Services.Interfaces;

namespace MyGamingListAPI.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class HomeGamesController(IHomeGamesService homeGamesService) : ControllerBase
    {
        private readonly IHomeGamesService _homeGamesService = homeGamesService;

        [HttpGet]
        public async Task<IActionResult> GetUpcomingAndHotGames()
        {
            try
            {
                var games = await _homeGamesService.GetNewHomeGamesAsync();

                if (games == null) return NotFound();

                return Ok(games);
            }
            catch
            {
                return BadRequest();
            }

        }

        [HttpGet("random-games")]
        public async Task<IActionResult> GetRandomHomeGames(CancellationToken cancellationToken = default)
        {
            try
            {
                var games = await _homeGamesService.GetRandomHomeGamesAsync(cancellationToken);
                if (games == null || games.Count == 0) return NotFound();
                return Ok(games);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}