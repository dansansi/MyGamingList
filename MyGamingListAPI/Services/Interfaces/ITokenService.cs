using Microsoft.AspNetCore.Identity;

namespace MyGamingListAPI.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(IdentityUser user, IList<string> roles);
    }
}
