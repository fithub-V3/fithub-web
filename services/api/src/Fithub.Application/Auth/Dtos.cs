namespace Fithub.Application.Auth;

public record RegisterRequest(string Email, string Password, string DisplayName);

public record LoginRequest(string Email, string Password);

public record RefreshRequest(string RefreshToken);

public record LogoutRequest(string RefreshToken);

// Never includes PasswordHash.
public record UserResponse(Guid Id, string Email, string DisplayName);

public record AuthResponse(string AccessToken, string RefreshToken, UserResponse User);
