namespace Fithub.Infrastructure.Services.Workouts;

public class WorkoutNotFoundException() : Exception("Workout not found.");

public class WorkoutNotOwnedException() : Exception("You do not have permission to modify this workout.");

public class InvalidExerciseReferenceException() : Exception("One or more exercises do not exist or do not belong to you.");