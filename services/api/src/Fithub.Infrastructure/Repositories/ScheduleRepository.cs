using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Persistence;
using Fithub.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Fithub.Infrastructure.Repositories;

public class ScheduleRepository(FithubDbContext dbContext) : IScheduleRepository
{
    public Task<List<Schedule>> GetAllDaysByUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return dbContext.Schedules
            .Where(w => w.UserId == userId)
            .Include(s => s.Workout)
            .ToListAsync();
    }

    public Task<Schedule?> GetDayByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return dbContext.Schedules
            .Include(s => s.Workout)
            .FirstOrDefaultAsync(w => w.Id == id, cancellationToken);
    }

    public async Task AddDayAsync(Schedule schedule, CancellationToken cancellationToken = default)
    {
        await dbContext.Schedules.AddAsync(schedule, cancellationToken);
    }

    public void Update(Schedule schedule)
    {
        dbContext.Schedules.Update(schedule);
    }

    public void Delete(Schedule schedule)
    {
        dbContext.Schedules.Remove(schedule);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        dbContext.SaveChangesAsync(cancellationToken);
}