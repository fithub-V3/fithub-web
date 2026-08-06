using Fithub.Infrastructure.Entities;

public record ScheduleDto
{
    public Guid Id { get; init; }
    public Guid WorkoutId { get; init; }
    public string WorkoutName { get; init; } = string.Empty;
    public DayOfWeek DayOfWeek { get; init; }
}

public record CreateScheduleRequest
{
    public Guid WorkoutId { get; init; }
    public DayOfWeek DayOfWeek { get; init; }
}

public record UpdateScheduleRequest
{
    public Guid WorkoutId { get; init; }
    public DayOfWeek DayOfWeek { get; init; }
}