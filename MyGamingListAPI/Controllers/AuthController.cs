using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyGamingListAPI.DTOs.Auth;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Implementations;
using MyGamingListAPI.Services.Interfaces;
using System.Net;

namespace MyGamingListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(UserManager<AppUser> userManager, ITokenService tokenService, IEmailService emailService) : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager = userManager;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IEmailService _emailService = emailService;

        [HttpPost("register")]

        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var userExists = await _userManager.FindByNameAsync(dto.UserName);
            if (userExists != null) return BadRequest("Usuario já cadastrado");
             
            var emailExists = await _userManager.FindByEmailAsync(dto.Email);
            if (emailExists != null) return BadRequest("E-mail já cadastrado");

            var user = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email,

            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "User");

            return Ok("Usuário criado");
            
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            AppUser user;

            if (dto.Login.Contains("@"))
            {
                user = await _userManager.FindByEmailAsync(dto.Login);
            }
            else
            {
                user = await _userManager.FindByNameAsync(dto.Login);
            }
            if (user == null) return Unauthorized("Usuario inválido");

            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!validPassword) return Unauthorized("Senha inválida");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.GenerateToken(user, roles);

            return Ok(new { token });
        }

        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPasswordTokenGenerator([FromBody] PasswordRecoveryDto dto)
        {  
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return Ok();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(token);

            return Ok(new
            {
                email = dto.Email,
                token = encodedToken
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return Ok();

            var decodedToken = WebUtility.UrlDecode(dto.Token);

            var result = await _userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok("Senha redefinida!");
        }
    }
}
