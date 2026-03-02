using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyGamingListAPI.DTOs.Game;
using MyGamingListAPI.Services.Interfaces;

namespace MyGamingListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController(IGameService gameService) : ControllerBase
    {
        private readonly IGameService _gameService = gameService;

        [HttpGet]
        public async Task<IActionResult> GetAllGames()
        {
            var games = await _gameService.GetAllAsync();
            return Ok(games);
        }

        [HttpGet("{externalId}")]
        public async Task<IActionResult> GetGameById(int externalId)
        {
            var game = await _gameService.GetOrCreateGameByIdAsync(externalId);
            {
                if (game == null) return NotFound();
            }
            return Ok(game);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateGameAsync([FromBody] GameCreateDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Name))
                return BadRequest();

            var createdGame = await _gameService.CreateAsync(dto);

            return CreatedAtAction(nameof(GetGameById), new
            {
                externalId = createdGame.ExternalId
            }, createdGame);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGameAsync(int id,  [FromBody] GameUpdateDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Name))
                return BadRequest();

            var success = await _gameService.UpdateAsync(id, dto);
            if (success == null) return NotFound();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameAsync(int id)
        {
            var success = await _gameService.DeleteAsync(id);

            if (!success) return NotFound();
            return NoContent();
        }
    }
} 