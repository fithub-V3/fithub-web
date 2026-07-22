namespace Fithub.Domain.Entities;

public class Exercise
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MuscleGroup { get; set; } = string.Empty;
    public string Equipment { get; set; } = string.Empty;

    // Null = system exercise (not created by any user).
    public Guid? CreatedById { get; set; }
    public User? CreatedBy { get; set; }

    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    public ICollection<SetLog> SetLogs { get; set; } = new List<SetLog>();
}
