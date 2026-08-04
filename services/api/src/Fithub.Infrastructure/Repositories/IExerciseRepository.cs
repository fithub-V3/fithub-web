using Fithub.Infrastructure.Entities;

namespace Fithub.Infrastructure.Repositories;

public interface IExerciseRepository
{
    Task<List<Exercise>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Exercise?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Exercise exercise, CancellationToken cancellationToken = default);
    void Update(Exercise exercise);
    void Delete(Exercise exercise);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<List<Exercise>> GetAllByUserIdsOnlyAsync(Guid userId, CancellationToken cancellationToken = default);
}