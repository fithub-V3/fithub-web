namespace Fithub.Domain.Entities;

public class SetLog
{
    public Guid Id { get; set; }
    public Guid WorkoutLogId { get; set; }
    public WorkoutLog WorkoutLog { get; set; } = null!;
    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;
    public int SetNumber { get; set; }
    public int Reps { get; set; }
    public decimal WeightKg { get; set; }
    public decimal? Rpe { get; set; }
    public DateTime CompletedAt { get; set; }
}
