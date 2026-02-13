namespace MyGamingListAPI.DTOs.Auth
{
    public class PasswordRecoveryDto
    {
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}
