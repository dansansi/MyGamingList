using MyGamingListAPI.DTOs.Auth;

namespace MyGamingListAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterAsync(RegisterDTO dto);
        Task<(bool Success, string? Token, string Message)> LoginAsync(LoginDto dto);
        Task ForgotPasswordAsync(string email);
        Task<(bool Success, IEnumerable<string> Errors)> ResetPasswordAsync(ResetPasswordDto dto);
    }
}