namespace Fithub.Infrastructure.Services.Exercises;

public class ExerciseNotFoundException() : Exception("Exercise not found.");

public class ExerciseNotOwnedException() : Exception("You do not have permission to modify this exercise.");