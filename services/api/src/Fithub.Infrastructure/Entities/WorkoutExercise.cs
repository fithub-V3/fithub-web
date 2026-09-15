namespace Fithub.Infrastructure.Entities;

public class WorkoutExercise
{
    public Guid Id { get; set; }
    public Guid WorkoutId { get; set; }
    public Workout Workout { get; set; } = null!;
    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;
    public int OrderIndex { get; set; }
    public int TargetSets { get; set; }
    public int TargetReps { get; set; }

    // Null = no target weight set for this slot yet.
    public decimal? TargetWeightKg { get; set; }

    public ICollection<SetLog> SetLogs { get; set; } = new List<SetLog>();
}
