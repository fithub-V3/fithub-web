using Fithub.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fithub.Infrastructure.Persistence.Configurations;

public class WorkoutExerciseConfiguration : IEntityTypeConfiguration<WorkoutExercise>
{
    public void Configure(EntityTypeBuilder<WorkoutExercise> builder)
    {
        builder.ToTable("workout_exercises");

        builder.HasKey(we => we.Id);
        builder.Property(we => we.Id).HasColumnName("id");
        builder.Property(we => we.WorkoutId).HasColumnName("workout_id");
        builder.Property(we => we.ExerciseId).HasColumnName("exercise_id");
        builder.Property(we => we.OrderIndex).HasColumnName("order_index");
        builder.Property(we => we.TargetSets).HasColumnName("target_sets");
        builder.Property(we => we.TargetReps).HasColumnName("target_reps");

        builder.HasOne(we => we.Workout)
            .WithMany(w => w.WorkoutExercises)
            .HasForeignKey(we => we.WorkoutId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(we => we.Exercise)
            .WithMany(e => e.WorkoutExercises)
            .HasForeignKey(we => we.ExerciseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
