using Microsoft.AspNetCore.Identity;
using MyGamingListAPI.DTOs.Auth;
using MyGamingListAPI.Models;
using MyGamingListAPI.Services.Interfaces;
using System.Net;

namespace MyGamingListAPI.Services.Implementations
{
    public class AuthService(
        UserManager<AppUser> userManager,
        ITokenService tokenService,
        IEmailService emailService,
        IConfiguration configuration) : IAuthService
    {
        private readonly UserManager<AppUser> _userManager = userManager;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IEmailService _emailService = emailService;
        private readonly IConfiguration _configuration = configuration;

        public async Task<(bool Success, string Message)> RegisterAsync(RegisterDTO dto)
        {
            if (await _userManager.FindByNameAsync(dto.UserName) != null)
                return (false, "Usuário já cadastrado");

            if (await _userManager.FindByEmailAsync(dto.Email) != null)
                return (false, "E-mail já cadastrado");

            var user = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, "User");
            return (true, "Usuário criado");
        }

        public async Task<(bool Success, string? Token, string Message)> LoginAsync(LoginDto dto)
        {
            var user = dto.Login.Contains("@")
                ? await _userManager.FindByEmailAsync(dto.Login)
                : await _userManager.FindByNameAsync(dto.Login);

            if (user == null)
                return (false, null, "Usuário inválido");

            if (!await _userManager.CheckPasswordAsync(user, dto.Password))
                return (false, null, "Senha inválida");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.GenerateToken(user, roles);
            return (true, token, "Login realizado");
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(token);

            var frontEndUrl = _configuration["FrontEnd:BaseUrl"];
            var resetLink = $"{frontEndUrl}/reset-password?token={encodedToken}&email={email}";

            var body = $@"
                <p>Você solicitou a redefinição de senha.</p>
                <p><a href='{resetLink}'>Clique aqui para redefinir sua senha.</a></p>
                <p>Se não foi você, ignore este e-mail.</p>
                <small>Este link expira em 1 hora.</small>
            ";

            await _emailService.SendPasswordRedoEmailAsync(email, "Redefinição de senha MyGamingList", body);
        }

        public async Task<(bool Success, IEnumerable<string> Errors)> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return (true, []);

            var decodedToken = WebUtility.UrlDecode(dto.Token).Replace(" ", "+");
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);

            if (!result.Succeeded)
                return (false, result.Errors.Select(e => e.Description));

            return (true, []);
        }
    }
}