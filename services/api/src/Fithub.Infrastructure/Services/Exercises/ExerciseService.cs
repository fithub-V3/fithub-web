using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Repositories;

namespace Fithub.Infrastructure.Services.Exercises;

public class ExerciseService(IExerciseRepository exerciseRepository) : IExerciseService
{
    public async Task<List<ExerciseDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var exercises = await exerciseRepository.GetAllByUserAsync(userId, cancellationToken);
        return exercises.Select(ToDto).ToList();
    }

    public async Task<ExerciseDto> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var exercise = await GetOwnedExerciseAsync(id, userId, cancellationToken);
        return ToDto(exercise);
    }

    public async Task<ExerciseDto> CreateAsync(CreateExerciseRequest request, Guid userId, CancellationToken cancellationToken = default)
    {
        var exercise = new Exercise
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            MuscleGroup = request.MuscleGroup,
            Equipment = request.Equipment,
            CreatedById = userId,
        };

        await exerciseRepository.AddAsync(exercise, cancellationToken);
        await exerciseRepository.SaveChangesAsync(cancellationToken);

        return ToDto(exercise);
    }

    public async Task<ExerciseDto> UpdateAsync(UpdateExerciseRequest request, Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var exercise = await GetOwnedExerciseAsync(id, userId, cancellationToken);

        exercise.Name = request.Name;
        exercise.MuscleGroup = request.MuscleGroup;
        exercise.Equipment = request.Equipment;

        exerciseRepository.Update(exercise);
        await exerciseRepository.SaveChangesAsync(cancellationToken);

        return ToDto(exercise);
    }

    public async Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var exercise = await GetOwnedExerciseAsync(id, userId, cancellationToken);

        exerciseRepository.Delete(exercise);
        await exerciseRepository.SaveChangesAsync(cancellationToken);
    }

    // Loads the exercise and verifies the requesting user owns it, throwing
    // the appropriate exception otherwise. Shared by every method that acts
    // on a single exercise by id.
    private async Task<Exercise> GetOwnedExerciseAsync(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        var exercise = await exerciseRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new ExerciseNotFoundException();

        if (exercise.CreatedById != userId)
        {
            throw new ExerciseNotOwnedException();
        }

        return exercise;
    }

    private static ExerciseDto ToDto(Exercise exercise) => new()
    {
        Id = exercise.Id,
        Name = exercise.Name,
        MuscleGroup = exercise.MuscleGroup,
        Equipment = exercise.Equipment,
    };
}