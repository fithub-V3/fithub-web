using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Persistence;
using Fithub.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

public class WorkoutRepository(FithubDbContext dbContext) : IWorkoutRepository
{
    public Task<List<Workout>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return dbContext.Workouts
            .Where(w => w.UserId == userId)
            .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Exercise)
            .ToListAsync(cancellationToken);
    }

    public Task<Workout?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return dbContext.Workouts
            .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Exercise)
            .FirstOrDefaultAsync(w => w.Id == id, cancellationToken);
    }

    public async Task AddAsync(Workout workout, CancellationToken cancellationToken = default)
    {
        await dbContext.Workouts.AddAsync(workout, cancellationToken);
    }

    public void Update(Workout workout)
    {
        dbContext.Workouts.Update(workout);
    }

    public void Delete(Workout workout)
    {
        dbContext.Workouts.Remove(workout);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        dbContext.SaveChangesAsync(cancellationToken);

    public void AddWorkoutExercise(WorkoutExercise workoutExercise) => 
        dbContext.WorkoutExercises.Add(workoutExercise);
}