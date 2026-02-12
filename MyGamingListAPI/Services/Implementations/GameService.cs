using Microsoft.EntityFrameworkCore;
using MyGamingListAPI.Data;
using MyGamingListAPI.DTOs.Game;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Interfaces;

namespace MyGamingListAPI.Services.Implementations
{
    public class GameService : IGameService
    {
        private readonly AppDbContext _context;

        public GameService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<GameReadDto> CreateAsync(GameCreateDto dto)
        {
            var game = new Game
            {
                Name = dto.Name,
            };

            _context.Add(game);
            await _context.SaveChangesAsync();

            return new GameReadDto
            {
                Id = game.Id,
                Name = game.Name
            }; 
        }

        public async Task<IEnumerable<GameReadDto>> GetAllAsync()
        {
            return await _context.Games.Select(g => new GameReadDto
            {
                Id = g.Id,
                Name = g.Name

            }).ToListAsync();
        }

        public async Task<GameReadDto?> GetByIdAsync(int id)
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

        public async Task<GameReadDto?> UpdateAsync(int id, GameUpdateDto dto)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null) return null;

            game.Name = dto.Name;
            
            await _context.SaveChangesAsync();

            return new GameReadDto
            {
                Id = game.Id,
                Name = game.Name,
            };
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return false;

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();
            return true;

            throw new NotImplementedException();
        }
    }
}
