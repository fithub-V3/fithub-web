using Fithub.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fithub.Infrastructure.Persistence.Configurations;

public class ScheduleConfiguration : IEntityTypeConfiguration<Schedule>
{
    public void Configure(EntityTypeBuilder<Schedule> builder)
    {
        builder.ToTable("schedules");

        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.UserId).HasColumnName("user_id");
        builder.Property(s => s.WorkoutId).HasColumnName("workout_id");
        builder.Property(s => s.DayOfWeek).HasColumnName("day_of_week");

        builder.HasOne<User>()
            .WithMany(u => u.Schedules)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.Workout)
            .WithMany(w => w.Schedules)
            .HasForeignKey(s => s.WorkoutId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
