using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyGamingListAPI.DTOs.UserGame;
using MyGamingListAPI.Services.Interfaces;
using System.Security.Claims;

namespace MyGamingListAPI.Controllers
{
    [ApiController]
    [Route("api/UserGame/[controller]")]
    [Authorize]
    public class UserGameController(IUserGameService userGameService) : ControllerBase
    {
        private readonly IUserGameService _userGameService = userGameService;
        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpGet]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetUserGames()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _userGameService.GetAllUserGamesAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> AddOrUpdateGame([FromBody] UserGameRequestDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _userGameService.AddOrUpdateGameOnListAsync(userId, dto);
            return Ok(result);
        }
        
        [HttpDelete("{externalId}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> DeleteGame([FromQuery] int externalId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _userGameService.RemoveGameFromUserListAsync(userId, externalId);
            if (!result) return NotFound();

            return NoContent(); 
        }
    }
}