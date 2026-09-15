namespace Fithub.Infrastructure.Entities;

public class WorkoutLog
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    // Null = ad-hoc log, not tied to a saved workout.
    public Guid? WorkoutId { get; set; }
    public Workout? Workout { get; set; }

    // Null = not tied to a specific scheduled entry (started from bank
    // directly, or ad-hoc).
    public Guid? ScheduleId { get; set; }
    public Schedule? Schedule { get; set; }

    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    public ICollection<SetLog> SetLogs { get; set; } = new List<SetLog>();
}
