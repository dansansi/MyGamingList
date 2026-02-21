using MyGamingListAPI.Services.Interfaces;
using System.Net;
using System.Net.Mail;

namespace MyGamingListAPI.Services.Implementations
{
    public class EmailService(ILogger<EmailService> logger, IConfiguration configuration) : IEmailService
    {
        private readonly string _smtpHost = "smtp.gmail.com";
        private readonly int _smtpPort = 587;
        private readonly string _smtpUser = "MyGamingListSansi@gmail.com";
        private readonly string _smtpPass = configuration["E-mail:Key"]!;
        private readonly ILogger<EmailService> _logger = logger;


        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                using var client = new SmtpClient(_smtpHost, _smtpPort)
                {
                    Credentials = new NetworkCredential(_smtpUser, _smtpPass),
                    EnableSsl = true
                };

                var mail = new MailMessage(_smtpUser, to, subject, body)
                {
                    IsBodyHtml = true
                };

                await client.SendMailAsync(mail);
                _logger.LogInformation("E-mail de redefiniçao de senha enviado para {Destinatario}", to);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao enviar e-mail para {Destinatario}", to);
                throw;
            }
        }
    }
}