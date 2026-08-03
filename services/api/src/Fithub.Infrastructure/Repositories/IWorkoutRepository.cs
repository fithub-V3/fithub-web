using Fithub.Infrastructure.Entities;

namespace Fithub.Infrastructure.Repositories;

public interface IWorkoutRepository
{
    Task<List<Workout>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Workout?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Workout workout, CancellationToken cancellationToken = default);
    void Update(Workout workout);
    void Delete(Workout workout);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}