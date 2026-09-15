namespace Fithub.Infrastructure.Dtos;

public record WorkoutExerciseDto
{
    public Guid Id { get; init; }
    public Guid ExerciseId { get; init; }
    public string ExerciseName { get; init; } = string.Empty;
    public int OrderIndex { get; init; }
    public int TargetSets { get; init; }
    public int TargetReps { get; init; }
    public decimal? TargetWeightKg { get; init; }
}

public record WorkoutDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public List<WorkoutExerciseDto> Exercises { get; init; } = new();
}

public record CreateWorkoutExerciseRequest
{
    public Guid ExerciseId { get; init; }
    public int OrderIndex { get; init; }
    public int TargetSets { get; init; }
    public int TargetReps { get; init; }
    public decimal? TargetWeightKg { get; init; }
}

public record CreateWorkoutRequest
{
    public string Name { get; init; } = string.Empty;
    public List<CreateWorkoutExerciseRequest> Exercises { get; init; } = new();
}

public record UpdateWorkoutExerciseRequest
{
    public Guid ExerciseId { get; init; }
    public int OrderIndex { get; init; }
    public int TargetSets { get; init; }
    public int TargetReps { get; init; }
    public decimal? TargetWeightKg { get; init; }
}

public record UpdateWorkoutRequest
{
    public string Name { get; init; } = string.Empty;
    public List<UpdateWorkoutExerciseRequest> Exercises { get; init; } = new();
}