using Fithub.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fithub.Infrastructure.Persistence.Configurations;

public class SetLogConfiguration : IEntityTypeConfiguration<SetLog>
{
    public void Configure(EntityTypeBuilder<SetLog> builder)
    {
        builder.ToTable("set_logs");

        builder.HasKey(sl => sl.Id);
        builder.Property(sl => sl.Id).HasColumnName("id");
        builder.Property(sl => sl.WorkoutLogId).HasColumnName("workout_log_id");
        builder.Property(sl => sl.WorkoutExerciseId).HasColumnName("workout_exercise_id");
        builder.Property(sl => sl.SetNumber).HasColumnName("set_number");
        builder.Property(sl => sl.Reps).HasColumnName("reps");

        // weight_kg: e.g. up to 9999.99. rpe: RPE scale is 0-10 in 0.5 steps, e.g. 9.5.
        builder.Property(sl => sl.WeightKg).HasColumnName("weight_kg").HasPrecision(6, 2);
        builder.Property(sl => sl.Rpe).HasColumnName("rpe").HasPrecision(3, 1);

        builder.Property(sl => sl.CompletedAt).HasColumnName("completed_at");

        builder.HasOne(sl => sl.WorkoutLog)
            .WithMany(wl => wl.SetLogs)
            .HasForeignKey(sl => sl.WorkoutLogId)
            .OnDelete(DeleteBehavior.Cascade);

        // A SetLog maps to the specific planned WorkoutExercise slot, not just the exercise
        // in general. WorkoutExercise rows are only ever deleted via their parent Workout's
        // full-replace-on-update (Clear() + re-Add()), so this cascade also fires whenever a
        // workout's exercises are edited, deleting logs tied to the replaced slots.
        builder.HasOne(sl => sl.WorkoutExercise)
            .WithMany(we => we.SetLogs)
            .HasForeignKey(sl => sl.WorkoutExerciseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
