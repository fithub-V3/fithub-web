// Reason for using { get; init; } instead of { get; set; } is because using init means once you set it it cannot be changed, since there is no reason we'd want that to happen using init enforces it
// (Doesn't mean it cant be changed by the user in the app later, it just affects that object in C# memory)

public record ExerciseDto 
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string MuscleGroup { get; init; } = string.Empty;
    public string Equipment { get; init; } = string.Empty;
}

public record CreateExerciseRequest
{
    public string Name { get; init; } = string.Empty;
    public string MuscleGroup { get; init; } = string.Empty;
    public string Equipment { get; init; } = string.Empty;
}

public record UpdateExerciseRequest
{
    public string Name { get; init; } = string.Empty;
    public string MuscleGroup { get; init; } = string.Empty;
    public string Equipment { get; init; } = string.Empty;
}