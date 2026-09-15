using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Fithub.Infrastructure.Repositories;

public class WorkoutLogRepository(FithubDbContext dbContext) : IWorkoutLogRepository
{
    public async Task<List<WorkoutLog>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await dbContext.WorkoutLogs
            .Where(l => l.UserId == userId)
            .Include(l => l.Workout)
            .Include(l => l.SetLogs)
                .ThenInclude(s => s.WorkoutExercise)
                    .ThenInclude(we => we.Exercise)
            .OrderByDescending(l => l.StartedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<WorkoutLog?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.WorkoutLogs
            .Include(l => l.Workout)
            .Include(l => l.SetLogs)
                .ThenInclude(s => s.WorkoutExercise)
                    .ThenInclude(we => we.Exercise)
            .FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
    }

    public async Task AddAsync(WorkoutLog workoutLog, CancellationToken cancellationToken = default)
    {
        await dbContext.WorkoutLogs.AddAsync(workoutLog, cancellationToken);
    }

    public void Delete(WorkoutLog workoutLog)
    {
        dbContext.WorkoutLogs.Remove(workoutLog);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }



}