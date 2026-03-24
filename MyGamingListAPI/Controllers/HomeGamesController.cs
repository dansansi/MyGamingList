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
                var games = await _homeGamesService.GetHomeGamesAsync();

                if (games == null) return NotFound();

                return Ok(games);
            }
            catch
            {
                return BadRequest();
            }

        }
    }
}