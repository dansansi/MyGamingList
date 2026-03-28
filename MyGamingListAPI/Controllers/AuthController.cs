using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyGamingListAPI.DTOs.Auth;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Interfaces;
using System.Net;
using System.Security.Claims;

namespace MyGamingListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(UserManager<AppUser> userManager, ITokenService tokenService, IEmailService emailService, IConfiguration configuration) : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager = userManager;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IEmailService _emailService = emailService;
        private readonly IConfiguration _configuration = configuration;

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
            AppUser? user;

            if (dto.Login.Contains("@"))
            {
                user = await _userManager.FindByEmailAsync(dto.Login);
            }
            else
            {
                user = await _userManager!.FindByNameAsync(dto.Login);
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

            var frontEndUrl = _configuration["FrontEnd:BaseUrl"];
            var resetLink = $"{frontEndUrl}/reset-password?token={encodedToken}&email={dto.Email}";

            var body = $@"
            <p>Você solicitou a redefinição de senha.<p>
            <p><a href='{resetLink}'>Clique aqui para redefinir sua senha.</a></p>
            <p>Se não foi voce, ignore este e-mail.<p>
            <small> Este link expira em 1 hora.</small>
            ";

            await _emailService.SendPasswordRedoEmailAsync(dto.Email, "Redefinição de senha MyGamingList", body);

            return Ok(encodedToken);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return Ok();

            var decodedToken = WebUtility.UrlDecode(dto.Token);
            var finalToken = decodedToken.Replace(" ", "+");

            var result = await _userManager.ResetPasswordAsync(user, finalToken, dto.NewPassword);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok("Senha redefinida!");
        }

        [HttpGet("currentUser")]
        [Authorize]
        public IActionResult GetCurrentUser() {

            var username = User.FindFirstValue(ClaimTypes.Name);
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (username == null || email == null)
            {
                return Unauthorized();
            }

            return Ok(new { username, email});
        }
    }
}
