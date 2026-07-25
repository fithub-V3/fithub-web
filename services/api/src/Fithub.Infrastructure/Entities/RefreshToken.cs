namespace Fithub.Infrastructure.Entities;

// Server-side record of an issued refresh token, so it can be looked up and revoked.
// Only a hash of the token is stored, never the raw value.
public class RefreshToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
}
