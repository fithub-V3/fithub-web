namespace Fithub.Infrastructure.Entities;

public class Workout
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Soft delete: excluded via a global query filter in FithubDbContext.
    public DateTime? DeletedAt { get; set; }

    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    public ICollection<WorkoutLog> WorkoutLogs { get; set; } = new List<WorkoutLog>();
    public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
}
