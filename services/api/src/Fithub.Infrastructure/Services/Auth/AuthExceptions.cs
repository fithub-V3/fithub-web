namespace Fithub.Infrastructure.Services.Auth;

// Thrown by AuthService; the Api layer maps these to HTTP status codes.
public class EmailAlreadyInUseException() : Exception("Email is already registered.");

public class InvalidCredentialsException() : Exception("Invalid email or password.");

public class InvalidRefreshTokenException() : Exception("Refresh token is invalid, expired, or revoked.");
