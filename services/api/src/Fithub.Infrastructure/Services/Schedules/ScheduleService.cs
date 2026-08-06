using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Repositories;
using Fithub.Infrastructure.Services.Workouts;

namespace Fithub.Infrastructure.Services.Schedules;

public class ScheduleService(
    IScheduleRepository scheduleRepository,
    IWorkoutRepository workoutRepository
) : IScheduleService
{
    public async Task<List<ScheduleDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var schedules = await scheduleRepository.GetAllDaysByUserAsync(userId, cancellationToken);
        return schedules.Select(ToDto).ToList();
    }

    public async Task<ScheduleDto> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var schedule = await GetOwnedScheduleAsync(id, userId, cancellationToken);
        return ToDto(schedule);
    }

    public async Task<ScheduleDto> CreateAsync(CreateScheduleRequest request, Guid userId, CancellationToken cancellationToken = default)
    {
        if (!Enum.IsDefined(request.DayOfWeek))
        {
            throw new InvalidDayOfWeekException();
        }
        await ValidateWorkoutOwnershipAsync(request.WorkoutId, userId, cancellationToken);

        var schedule = new Schedule
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WorkoutId = request.WorkoutId,
            DayOfWeek = request.DayOfWeek,
        };

        await scheduleRepository.AddDayAsync(schedule, cancellationToken);
        await scheduleRepository.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(schedule.Id, userId, cancellationToken);
    }

    public async Task<ScheduleDto> UpdateAsync(UpdateScheduleRequest request, Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        if (!Enum.IsDefined(request.DayOfWeek))
        {
            throw new InvalidDayOfWeekException();
        }

        await ValidateWorkoutOwnershipAsync(request.WorkoutId, userId, cancellationToken);
        
        var schedule = await GetOwnedScheduleAsync(id, userId, cancellationToken);

        schedule.WorkoutId = request.WorkoutId;
        schedule.DayOfWeek = request.DayOfWeek;

        await scheduleRepository.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, userId, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var schedule = await GetOwnedScheduleAsync(id, userId, cancellationToken);

        scheduleRepository.Delete(schedule);
        await scheduleRepository.SaveChangesAsync(cancellationToken);
    }

    private async Task ValidateWorkoutOwnershipAsync(Guid workoutId, Guid userId, CancellationToken cancellationToken = default)
    {
        var workout = await workoutRepository.GetByIdAsync(workoutId, cancellationToken);
        if (workout is null || workout.UserId != userId)
        {
            throw new InvalidWorkoutReferenceException();
        }
    }

    private async Task<Schedule> GetOwnedScheduleAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var schedule = await scheduleRepository.GetDayByIdAsync(id, cancellationToken)
            ?? throw new ScheduleNotFoundException();
        
        if (schedule.UserId != userId)
        {
            throw new ScheduleNotOwnedException();
        }

        return schedule;
    }

    private static ScheduleDto ToDto(Schedule schedule) => new()
    {
        Id = schedule.Id,
        WorkoutId = schedule.WorkoutId,
        WorkoutName = schedule.Workout.Name,
        DayOfWeek = schedule.DayOfWeek,
    };
}