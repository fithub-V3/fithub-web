using Fithub.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fithub.Infrastructure.Persistence.Configurations;

public class WorkoutConfiguration : IEntityTypeConfiguration<Workout>
{
    public void Configure(EntityTypeBuilder<Workout> builder)
    {
        builder.ToTable("workouts");

        builder.HasKey(w => w.Id);
        builder.Property(w => w.Id).HasColumnName("id");
        builder.Property(w => w.UserId).HasColumnName("user_id");
        builder.Property(w => w.Name).HasColumnName("name").IsRequired();
        builder.Property(w => w.CreatedAt).HasColumnName("created_at");
        builder.Property(w => w.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(w => w.User)
            .WithMany(u => u.Workouts)
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Soft-deleted workouts are hidden from every query by default;
        // use IgnoreQueryFilters() where deleted rows genuinely need to be seen.
        builder.HasQueryFilter(w => w.DeletedAt == null);
    }
}
