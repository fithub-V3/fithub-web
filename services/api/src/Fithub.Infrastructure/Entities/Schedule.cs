namespace Fithub.Infrastructure.Entities;

public class Schedule
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid WorkoutId { get; set; }
    public Workout Workout { get; set; } = null!;

    // 0 = Sunday .. 6 = Saturday, matching System.DayOfWeek's int values.
    public int DayOfWeek { get; set; }
}
