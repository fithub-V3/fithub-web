using Fithub.Infrastructure.Entities;

namespace Fithub.Infrastructure.Repositories;

public interface IWorkoutLogRepository
{
    Task<List<WorkoutLog>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<WorkoutLog?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(WorkoutLog workoutLog, CancellationToken cancellationToken = default);
    void Delete(WorkoutLog workoutLog);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}