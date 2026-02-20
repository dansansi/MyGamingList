using Microsoft.AspNetCore.Mvc;
using MyGamingListAPI.Services.Implementations;
using MyGamingListAPI.Services.Interfaces;


namespace MyGamingListAPI.Controllers
{
    [ApiController]
    [Route("rawgApi/[controller]")]
    public class RawgController : ControllerBase
    {
        private readonly IRawgApiService _rawgApiService;

        public RawgController(IRawgApiService rawgApiService)
        {
            _rawgApiService = rawgApiService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query, int page = 1, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(query)) return BadRequest("Busca vazia.");

            try
            {
                var games = await _rawgApiService.SearchGamesAsync(query, page);
                return Ok(games);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, "Erro ao consultar API externa.");
                
            }
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var game = await _rawgApiService.SearchGameByIdAsync(id);

            if (game == null) return NotFound();

            return Ok(game);
        }
    }
}
