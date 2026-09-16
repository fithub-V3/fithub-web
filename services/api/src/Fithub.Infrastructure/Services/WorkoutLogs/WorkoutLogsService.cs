using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Repositories;

namespace Fithub.Infrastructure.Services.WorkoutLogs;

public class WorkoutLogsService(
    IWorkoutLogRepository repository
) : IWorkoutLogService
{
    public async Task<List<WorkoutLogDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var logs = await repository.GetAllByUserAsync(userId, cancellationToken);
        return logs.Select(ToWorkoutLogDto).ToList();
    }

    public async Task<WorkoutLogDto> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var log = await repository.GetByIdAsync(id, userId, cancellationToken);
        return ToWorkoutLogDto(log);
    }

    public async Task<WorkoutLogDto> CreateAsync(CreateWorkoutLogRequest request, Guid userId, CancellationToken cancellationToken = default)
    {
        var log = new WorkoutLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WorkoutId = request.WorkoutId,
            ScheduleId = request.ScheduleId,
            StartedAt = request.StartedAt,
            CompletedAt = request.CompletedAt,
            SetLogs = (ICollection<SetLog>)request.SetLogs
        };

        await repository.AddAsync(log, cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);

        // If saved correctly with no issue, it should return the log it just created
        return await GetByIdAsync(log.Id, userId, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        // First get the log to check its actually there to be deleted
        var log = await repository.GetByIdAsync(id, userId, cancellationToken);

        // Add a null check? is it even needed
        repository.Delete(log);
        await repository.SaveChangesAsync(cancellationToken);       
    }

    private static WorkoutLogDto ToWorkoutLogDto(WorkoutLog? log) => new()
    {
        Id = log.Id,
        WorkoutId = log.WorkoutId,
        WorkoutName = log.Workout?.Name,
        ScheduleId = log.ScheduleId,
        StartedAt = log.StartedAt,
        CompletedAt = log.CompletedAt,
        SetLogs = (List<SetLogDto>)log.SetLogs
    };
}