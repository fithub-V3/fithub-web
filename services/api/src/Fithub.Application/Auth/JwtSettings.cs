namespace Fithub.Application.Auth;

// Plain POCO (not IOptions<T>) so Application doesn't need an Options/DI package reference;
// Api reads these from configuration and registers an instance directly.
public class JwtSettings
{
    public string SigningKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = "Fithub";
    public string Audience { get; set; } = "Fithub";
    public int AccessTokenLifetimeMinutes { get; set; } = 15;
    public int RefreshTokenLifetimeDays { get; set; } = 30;
}
