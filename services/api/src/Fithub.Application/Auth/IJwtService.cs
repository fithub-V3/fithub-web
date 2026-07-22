using Fithub.Domain.Entities;

namespace Fithub.Application.Auth;

public interface IJwtService
{
    // Short-lived, self-contained access token — not persisted.
    string GenerateAccessToken(User user);

    // Long-lived refresh token — the raw value is returned to the caller once,
    // only its hash is persisted (via IRefreshTokenRepository) so it can be revoked later.
    Task<string> GenerateRefreshTokenAsync(Guid userId, CancellationToken cancellationToken = default);

    // Returns the owning user id if the token is valid, unexpired, and unrevoked; otherwise null.
    Task<Guid?> ValidateRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);

    Task RevokeRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
}
