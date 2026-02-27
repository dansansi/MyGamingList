namespace MyGamingListAPI.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendPasswordRedoEmailAsync(string to, string subject, string body)(string to, string subject, string body);
    }
}
