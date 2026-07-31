using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;

namespace Fithub.Infrastructure.Services.Workouts;

public interface IWorkoutService
{
    Task<List<WorkoutDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<WorkoutDto> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<WorkoutDto> CreateAsync(CreateWorkoutRequest request, Guid userId, CancellationToken cancellationToken = default);
    Task<WorkoutDto> UpdateAsync(UpdateWorkoutRequest request, Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
}