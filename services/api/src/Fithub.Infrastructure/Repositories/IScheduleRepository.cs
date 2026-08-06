using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;

namespace Fithub.Infrastructure.Repositories;

public interface IScheduleRepository
{
    Task<List<Schedule>> GetAllDaysByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Schedule?> GetDayByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddDayAsync(Schedule schedule, CancellationToken cancellationToken = default);
    void Update(Schedule schedule);
    void Delete(Schedule schedule);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}