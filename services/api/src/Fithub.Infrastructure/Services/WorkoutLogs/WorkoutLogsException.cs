namespace Fithub.Infrastructure.Services.WorkoutLogs;

public class WorkoutLogNotFoundException() : Exception("Workout log not found.");

public class WorkoutLogNotOwnedException() : Exception("You do not have permission to access this log.");