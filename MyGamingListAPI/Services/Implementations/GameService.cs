using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using MyGamingListAPI.Data;
using MyGamingListAPI.DTOs.Game;
using MyGamingListAPI.DTOs.RawgApi;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Interfaces;

namespace MyGamingListAPI.Services.Implementations
{
    public class GameService(IRawgApiService rawgApiService, AppDbContext context, ILogger<GameService> logger) : IGameService
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger _logger = logger;
        private readonly IRawgApiService _rawgApiService = rawgApiService;

        public async Task<GameReadDto> CreateAsync(GameCreateDto dto)
        {
            try
            {
                var game = new Game
                {
                    ExternalId = dto.ExternalId,
                    Name = dto.Name,
                    Description = dto.Description,
                    Slug = dto.Slug,
                    Tba = dto.Tba,
                    BackgroundImage = dto.BackgroundImage,
                    ReleaseDate = dto.ReleaseDate,
                    Rating = dto.Rating,
                };

                _context.Add(game);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Jogo cadastrado com sucesso. {Game}", game.Name);
                return new GameReadDto
                {
                    ExternalId = game.ExternalId,
                    Name = game.Name,
                    Description = game.Description,
                    Rating = game.Rating,
                    ReleaseDate = game.ReleaseDate,
                    BackgroundImage = game.BackgroundImage,
                    Tba = game.Tba,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao cadastrar jogo {Game}.", dto.Name);
                throw;
            }
        }

        public async Task<IEnumerable<GameReadDto>> GetAllAsync()
        {
            try
            {
                return await _context.Games.Select(g => new GameReadDto
                {
                    Id = g.Id,
                    Name = g.Name

                }).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar lista de jogos do banco de dados.");
                throw;
            }
        }

        public async Task<GameReadDto?> GetOrCreateGameByIdAsync(int externalId)
        {
            try
            {
                //Procura do banco de dados
                var game = await _context.Games.FirstOrDefaultAsync(g => g.ExternalId == externalId);

                if (game == null)
                {
                    //Procura da Api
                    var apiGame = new RawgGameDto();
                    apiGame = await _rawgApiService.SearchGameByIdAsync(externalId);

                    if (apiGame == null) return (null);

                    var gameCreate = new GameCreateDto
                    {
                        ExternalId = apiGame.Id,
                        Name = apiGame.Name!,
                        Description = apiGame.Description!,
                        Slug = apiGame.Slug!,
                        BackgroundImage = apiGame.Background_Image!,
                        ReleaseDate = apiGame.Released,
                        Tba = apiGame.Tba,
                        Rating = apiGame.Rating,
                    };

                    //Cria jogo no banco de dados.
                    var createdGame = await CreateAsync(gameCreate);

                    return createdGame;
                }

                return new GameReadDto
                {
                    ExternalId = game.ExternalId,
                    Name = game.Name,
                    Description = game.Description,
                    Rating = game.Rating,
                    ReleaseDate = game.ReleaseDate,
                    Tba = game.Tba,
                    BackgroundImage = game.BackgroundImage,
                };
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogo da Api externa {Id}", externalId);
                throw;
            }
            catch (SqliteException ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogo do banco de dados {Id}", externalId);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogos {Id}", externalId);
                throw;
            }
        }

        public async Task<GameReadDto?> UpdateAsync(int id, GameUpdateDto dto)
        {
            try
            {
                var game = await _context.Games.FindAsync(id);
                if (game == null) return null;

                game.Name = dto.Name;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Dados do jogo {OldName} atualizado para {NewName}", game.Name, dto.Name);
                return new GameReadDto
                {
                    Id = game.Id,
                    Name = game.Name,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar jogo");
                throw;
            }
        }
        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var game = await _context.Games.FindAsync(id);

                if (game == null) return false;

                _context.Games.Remove(game);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Jogo excluido {Game}, id {Id}", game.Name, game.Id);
                return true;
            }
            catch (Exception ex) {
                _logger.LogError(ex, "Erro ao excluir jogo id:{Id}", id);
                throw;
            }
        }
    }
}
