using Fithub.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Fithub.Infrastructure.Persistence;

public class FithubDbContext(DbContextOptions<FithubDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<WorkoutExercise> WorkoutExercises => Set<WorkoutExercise>();
    public DbSet<WorkoutLog> WorkoutLogs => Set<WorkoutLog>();
    public DbSet<SetLog> SetLogs => Set<SetLog>();
    public DbSet<Schedule> Schedules => Set<Schedule>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(FithubDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
