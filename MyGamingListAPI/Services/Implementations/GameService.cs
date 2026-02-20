using Microsoft.EntityFrameworkCore;
using MyGamingListAPI.Data;
using MyGamingListAPI.DTOs.Game;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Interfaces;

namespace MyGamingListAPI.Services.Implementations
{
    public class GameService(AppDbContext context, ILogger<GameService> logger) : IGameService
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger _logger = logger;

        public async Task<GameReadDto> CreateAsync(GameCreateDto dto)
        {
            try
            {
                var game = new Game
                {
                    ExternalID = dto.ExternalID,
                    Name = dto.Name,
                    Description = dto.Description,
                    Slug = dto.Slug,
                    BackgroundImage = dto.BackgroundImage,
                    ReleaseDate = dto.ReleaseDate,
                    Rating = dto.Rating,
                };

                _context.Add(game);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Jogo cadastrado com sucesso. {Game}", game.Name);
                return new GameReadDto
                {
                    Id = game.Id,
                    Name = game.Name
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message,"Erro ao cadastrar jogo {Game}.", dto.Name);
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
                _logger.LogError(ex, "Erro buscar dados");
                throw;
            }
        }

        public async Task<GameReadDto?> GetByIdAsync(int id)
        {
            try
            {
                var game = await _context.Games.FindAsync(id);
                {
                    if (game == null) return null;

                    return new GameReadDto
                    {
                        Id = game.Id,
                        Name = game.Name
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar jogo {id}", id);
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

                _logger.LogInformation("Dados do jogo {OldName} atualizado para {NewName}", dto.Name, game.Name);
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
