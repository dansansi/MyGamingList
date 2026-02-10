using Microsoft.AspNetCore.Mvc;
using MyGamingListAPI.DTOs.Game;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Interfaces;

namespace MyGamingListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GameController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGames()
        {
            var games = await _gameService.GetAllAsync();
            return Ok(games);
         }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAllGamesById(int id)
        {
            var game = await _gameService.GetByIdAsync(id);
            {
                if (game == null) return NotFound();
            }
            return Ok(game);
        }
    }
} 