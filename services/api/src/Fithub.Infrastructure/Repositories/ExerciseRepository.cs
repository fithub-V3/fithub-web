using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Persistence;
using Fithub.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

public class ExerciseRepository(FithubDbContext dbContext) : IExerciseRepository 
{
    public Task<List<Exercise>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default) {
        return dbContext.Exercises
            .Where(e => e.CreatedById == userId)
            .ToListAsync(cancellationToken);
            // When we implement system exercises, we need to have .Where(e => e.CreatedById == userId || e.CreatedById == null)
    }

    public Task<Exercise?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        dbContext.Exercises.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public async Task AddAsync(Exercise exercise, CancellationToken cancellationToken = default) =>
        await dbContext.Exercises.AddAsync(exercise, cancellationToken);

    public void Update(Exercise exercise) => 
        dbContext.Exercises.Update(exercise);
    
    public void Delete(Exercise exercise) =>
        dbContext.Exercises.Remove(exercise);
    
    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        dbContext.SaveChangesAsync(cancellationToken);

    public Task<List<Exercise>> GetAllByUserIdsOnlyAsync(Guid userId, CancellationToken cancellationToken = default) =>
        dbContext.Exercises
            .AsNoTracking()
            .Where(e => e.CreatedById == userId)
            .ToListAsync(cancellationToken);
}