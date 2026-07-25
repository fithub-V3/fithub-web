using Fithub.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fithub.Infrastructure.Persistence.Configurations;

public class ExerciseConfiguration : IEntityTypeConfiguration<Exercise>
{
    public void Configure(EntityTypeBuilder<Exercise> builder)
    {
        builder.ToTable("exercises");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Name).HasColumnName("name").IsRequired();
        builder.Property(e => e.MuscleGroup).HasColumnName("muscle_group").IsRequired();
        builder.Property(e => e.Equipment).HasColumnName("equipment").IsRequired();
        builder.Property(e => e.CreatedById).HasColumnName("created_by");

        // Null created_by = system exercise; keep it on delete of the creating user.
        builder.HasOne(e => e.CreatedBy)
            .WithMany(u => u.CreatedExercises)
            .HasForeignKey(e => e.CreatedById)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
