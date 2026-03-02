using Microsoft.EntityFrameworkCore;
using MyGamingListAPI.Data;
using MyGamingListAPI.DTOs.UserGame;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Interfaces;

namespace MyGamingListAPI.Services.Implementations
{
    public class UserGameService(AppDbContext dbContext, ILogger<UserGameService> logger) : IUserGameService
    {

        private readonly AppDbContext _dbContext = dbContext;
        private readonly ILogger _logger = logger;


        public async Task<UserGameResponseDto> AddOrUpdateGameOnListAsync(string userId, UserGameRequestDto dto)
        {
            try
            {
                var game = await _dbContext.Games.FirstOrDefaultAsync(g => g.ExternalId == dto.ExternalId);

                var userGame = await _dbContext.UserGames.FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GameId == game!.Id);
                if (userGame == null)
                {
                    userGame = new UserGames
                    {
                        UserId = userId,
                        GameId = game!.Id,
                        Status = dto.Status,
                        IsFavorite = dto.IsFavorite,
                    };

                    _dbContext.UserGames.Add(userGame);
                    _logger.LogInformation("Jogo {Game} adicionado à lista do usuario {UserId}", game!.Name, userId);

                }
                else
                {
                    userGame.Status = dto.Status;
                    userGame.IsFavorite = dto.IsFavorite;
                    _logger.LogInformation("Jogo {Game} teve o status atualizado na lista do usuario {UserId}",game!.Name, userId);
                }
                await _dbContext.SaveChangesAsync();

                return new UserGameResponseDto
                {
                    ExternalId = dto.ExternalId,
                    GameName = game!.Name,
                    Status = userGame.Status,
                    IsFavorite = userGame.IsFavorite,
                    CreatedAt = userGame.CreatedAt,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao adicionar ou atualizar jogo na lista do user {userId}.", userId);
                throw;
            };
        }
        public async Task<IEnumerable<UserGameResponseDto>> GetAllUserGamesAsync(string userId)
        {
            try
            {
                var game = await _dbContext.UserGames
                .Where(ug => ug.UserId == userId)
                .Include(ug => ug.Game)
                .Select(ug => new UserGameResponseDto
                {
                    ExternalId = ug.Game.ExternalId,
                    GameName = ug.Game.Name,
                    Status = ug.Status,
                    IsFavorite = ug.IsFavorite,
                    CreatedAt = ug.CreatedAt,
                }).AsNoTracking().ToListAsync();
                return game;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar lista de jogos do usuario {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> RemoveGameFromUserListAsync(string userId, int externalId)
        {
            try
            {
                var dbGame = await _dbContext.Games.FirstOrDefaultAsync(g => g.ExternalId == externalId);
                if (dbGame == null) return false;

                var gameToRemove = await _dbContext.UserGames
                    .FirstOrDefaultAsync(rg => rg.UserId == userId && rg.GameId == dbGame.Id);

                if (gameToRemove == null) return false;

                _dbContext.UserGames.Remove(gameToRemove);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation("{GameName} foi removido da lista do usuario {UserId}",dbGame.Name, userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Não foi possivel excluir o jogo da lista do usuario {UserId}", userId);
                throw;
            }
        }
    }
}