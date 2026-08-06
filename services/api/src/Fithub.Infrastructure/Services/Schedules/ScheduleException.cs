namespace Fithub.Infrastructure.Services.Schedules;

public class ScheduleNotFoundException() : Exception("Schedule not found.");

public class ScheduleNotOwnedException() : Exception("You do not have permission to modify this schedule");

public class InvalidDayOfWeekException() : Exception("Invalid day of week");

public class InvalidWorkoutReferenceException() : Exception("Invalid workout reference");