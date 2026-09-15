namespace Fithub.Infrastructure.Dtos;

public record WorkoutLogDto
{
    public required Guid Id { get; init; }
    public Guid? WorkoutId { get; init; }
    public string? WorkoutName { get; init; }
    public Guid? ScheduleId { get; init; }
    public required DateTime StartedAt { get; init; }
    public required DateTime CompletedAt { get; init; }
    public required List<SetLogDto> SetLogs { get; init; }
}

public record SetLogDto
{
    public required Guid Id { get; init; }
    public required Guid WorkoutExerciseId { get; init; }
    public required Guid ExerciseId { get; init; }
    public required string ExerciseName { get; init; }
    public required int SetNumber { get; init; }
    public required int Reps { get; init; }
    public required decimal WeightKg { get; init; }
    public decimal? Rpe { get; init; }
    public required DateTime CompletedAt { get; init; }
    public int? TargetSets { get; init; }
    public int? TargetReps { get; init; }
    public decimal? TargetWeightKg { get; init; }
}

public record CreateWorkoutLogRequest
{
    public Guid? WorkoutId { get; init; }
    public Guid? ScheduleId { get; init; }
    public DateTime StartedAt { get; init; }
    public DateTime CompletedAt { get; init; }
    public required List<CreateSetLogRequest> SetLogs { get; init; }
}

public record CreateSetLogRequest
{
    public required Guid WorkoutExerciseId { get; init; }
    public required int SetNumber { get; init; }
    public required int Reps { get; init; }
    public required decimal WeightKg { get; init; }
    public decimal? Rpe { get; init; }
    public required DateTime CompletedAt { get; init; }
}