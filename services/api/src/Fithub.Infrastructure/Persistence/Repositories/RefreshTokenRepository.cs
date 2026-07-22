using Fithub.Domain.Entities;
using Fithub.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Fithub.Infrastructure.Persistence.Repositories;

public class RefreshTokenRepository(FithubDbContext dbContext) : IRefreshTokenRepository
{
    public Task<RefreshToken?> GetByTokenHashAsync(string tokenHash, CancellationToken cancellationToken = default) =>
        dbContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash, cancellationToken);

    public async Task AddAsync(RefreshToken refreshToken, CancellationToken cancellationToken = default) =>
        await dbContext.RefreshTokens.AddAsync(refreshToken, cancellationToken);

    public void Update(RefreshToken refreshToken) => dbContext.RefreshTokens.Update(refreshToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        dbContext.SaveChangesAsync(cancellationToken);
}
