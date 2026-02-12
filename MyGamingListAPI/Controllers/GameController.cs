using Microsoft.AspNetCore.Authorization;
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

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAllGamesById(int id)
        {
            var game = await _gameService.GetByIdAsync(id);
            {
                if (game == null) return NotFound();
            }
            return Ok(game);
        }

        [HttpPost]
        
        public async Task<IActionResult> CreateGameAsync([FromBody] GameCreateDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Name)) 
                return BadRequest();
            
            var createdGame = await _gameService.CreateAsync(dto);

            return CreatedAtAction(nameof(GetAllGamesById), new
            {
                id = createdGame.Id }, createdGame);
            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGameAsync(int id,  [FromBody] GameUpdateDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Name))
                return BadRequest();

            var success = await _gameService.UpdateAsync(id, dto);
            if (success == null) return NotFound();

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteGameAsync(int id)
        {
            var success = await _gameService.DeleteAsync(id);

            if (!success) return NotFound();
            return NoContent();
        }
    }
} 