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
        // target_weight_kg: same precision/scale convention as SetLog.WeightKg, e.g. up to 9999.99.
        builder.Property(we => we.TargetWeightKg).HasColumnName("target_weight_kg").HasPrecision(6, 2);

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
