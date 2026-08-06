using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;

namespace Fithub.Infrastructure.Services.Schedules;

public interface IScheduleService
{
    Task<List<ScheduleDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ScheduleDto> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<ScheduleDto> CreateAsync(CreateScheduleRequest request, Guid userId, CancellationToken cancellationToken = default);
    Task<ScheduleDto> UpdateAsync(UpdateScheduleRequest request, Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
}