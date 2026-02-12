using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using MyGamingListAPI.DTOs;
using MyGamingListAPI.DTOs.Auth;
using MyGamingListAPI.Services.Implementations;

namespace MyGamingListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(UserManager<IdentityUser> userManager, TokenService tokenService) : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager = userManager;
        private readonly TokenService _tokenService = tokenService;

        [HttpGet("register")]

        public async Task<IActionResult> RegisterDTO(RegisterDTO dto)
        {
            var userExists = await _userManager.FindByNameAsync(dto.UsernName);
            if (userExists != null) return BadRequest("Usuario já cadastrado");

            var user = new IdentityUser
            {
                UserName = dto.UsernName,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok("Usuário criado");
            
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login (LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.UserName);

            if (user == null) return Unauthorized("Usuario inválido");

            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);

            if (!validPassword) return Unauthorized("Senha inválida");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.GenerateToken(user, roles);

            return Ok(new { token });

            throw new NotImplementedException();
        }

    }
}
