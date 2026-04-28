using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Mvc;
using MyGamingListAPI.DTOs.Auth;
using MyGamingListAPI.Services.Interfaces;
using System.Security.Claims;

namespace MyGamingListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var (success, message) = await _authService.RegisterAsync(dto);
            return success ? Ok(message) : BadRequest(message);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var (success, token, message) = await _authService.LoginAsync(dto);
            if (!success) return Unauthorized(message);

            Response.Cookies.Append("token", token!, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(15)

            });

            return Ok(new { token });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] PasswordRecoveryDto dto)
        {
            await _authService.ForgotPasswordAsync(dto.Email!);
            return Ok();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var (success, errors) = await _authService.ResetPasswordAsync(dto);
            return success ? Ok("Senha redefinida!") : BadRequest(errors);
        }

        [HttpGet("current-user")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var email = User.FindFirstValue(ClaimTypes.Email);

            if (username == null || email == null) return Unauthorized();

            return Ok(new {username, email});
        }
    }
}