using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;

namespace Fithub.Infrastructure.Services.WorkoutLogs;

public interface IWorkoutLogService
{
    Task<List<WorkoutLogDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<WorkoutLogDto> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<WorkoutLogDto> CreateAsync(CreateWorkoutLogRequest rqeuest, Guid userId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
}