using Fithub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fithub.Infrastructure.Persistence.Configurations;

public class WorkoutLogConfiguration : IEntityTypeConfiguration<WorkoutLog>
{
    public void Configure(EntityTypeBuilder<WorkoutLog> builder)
    {
        builder.ToTable("workout_logs");

        builder.HasKey(wl => wl.Id);
        builder.Property(wl => wl.Id).HasColumnName("id");
        builder.Property(wl => wl.UserId).HasColumnName("user_id");
        builder.Property(wl => wl.WorkoutId).HasColumnName("workout_id");
        builder.Property(wl => wl.StartedAt).HasColumnName("started_at");
        builder.Property(wl => wl.CompletedAt).HasColumnName("completed_at");

        builder.HasOne(wl => wl.User)
            .WithMany(u => u.WorkoutLogs)
            .HasForeignKey(wl => wl.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Nullable workout_id = ad-hoc log; keep the log if the workout is later deleted.
        builder.HasOne(wl => wl.Workout)
            .WithMany(w => w.WorkoutLogs)
            .HasForeignKey(wl => wl.WorkoutId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
