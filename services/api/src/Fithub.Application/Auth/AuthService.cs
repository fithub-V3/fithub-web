using Fithub.Domain.Entities;
using Fithub.Domain.Repositories;

namespace Fithub.Application.Auth;

public class AuthService(
    IUserRepository userRepository,
    IJwtService jwtService,
    IPasswordHasher passwordHasher) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var existing = await userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existing is not null)
        {
            throw new EmailAlreadyInUseException();
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = passwordHasher.Hash(request.Password),
            DisplayName = request.DisplayName,
            CreatedAt = DateTime.UtcNow,
        };

        await userRepository.AddAsync(user, cancellationToken);
        await userRepository.SaveChangesAsync(cancellationToken);

        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new InvalidCredentialsException();
        }

        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> RefreshAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var userId = await jwtService.ValidateRefreshTokenAsync(refreshToken, cancellationToken);
        if (userId is null)
        {
            throw new InvalidRefreshTokenException();
        }

        var user = await userRepository.GetByIdAsync(userId.Value, cancellationToken)
            ?? throw new InvalidRefreshTokenException();

        // Rotate: revoke the presented token and issue a fresh pair.
        await jwtService.RevokeRefreshTokenAsync(refreshToken, cancellationToken);

        return await IssueTokensAsync(user, cancellationToken);
    }

    public Task LogoutAsync(string refreshToken, CancellationToken cancellationToken = default) =>
        jwtService.RevokeRefreshTokenAsync(refreshToken, cancellationToken);

    private async Task<AuthResponse> IssueTokensAsync(User user, CancellationToken cancellationToken)
    {
        var accessToken = jwtService.GenerateAccessToken(user);
        var refreshToken = await jwtService.GenerateRefreshTokenAsync(user.Id, cancellationToken);

        return new AuthResponse(accessToken, refreshToken, new UserResponse(user.Id, user.Email, user.DisplayName));
    }
}
