using MyGamingListAPI.Services.Interfaces;
using System.Net;
using System.Net.Mail;

namespace MyGamingListAPI.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly string _smtpHost = "smtp.gmail.com";
        private readonly int _smtpPort = 587;
        private readonly string _smtpUser = "MyGamingListSansi@gmail.com";
        private readonly string _smtpPass = "************";

        public void SendEmail(string to, string subject, string body)
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

            client.Send(mail);
        }
    }
}
