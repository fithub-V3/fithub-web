using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Repositories;

namespace Fithub.Infrastructure.Services.Workouts;

public class WorkoutService(
    IWorkoutRepository workoutRepository,
    IExerciseRepository exerciseRepository) : IWorkoutService
{
    public async Task<List<WorkoutDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var workouts = await workoutRepository.GetAllByUserAsync(userId, cancellationToken);
        return workouts.Select(ToDto).ToList();
    }

    public async Task<WorkoutDto> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var workout = await GetOwnedWorkoutAsync(id, userId, cancellationToken);
        return ToDto(workout);
    }

    public async Task<WorkoutDto> CreateAsync(CreateWorkoutRequest request, Guid userId, CancellationToken cancellationToken = default)
    {
        await ValidateExerciseOwnershipAsync(request.Exercises.Select(e => e.ExerciseId), userId, cancellationToken);
        var workout = new Workout
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name,
            CreatedAt = DateTime.UtcNow,
            WorkoutExercises = request.Exercises.Select(e => new WorkoutExercise
            {
                Id = Guid.NewGuid(),
                ExerciseId = e.ExerciseId,
                OrderIndex = e.OrderIndex,
                TargetSets = e.TargetSets,
                TargetReps = e.TargetReps,
                TargetWeightKg = e.TargetWeightKg,
            }).ToList(),
        };

        await workoutRepository.AddAsync(workout, cancellationToken);
        await workoutRepository.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(workout.Id, userId, cancellationToken);    
    }

    public async Task<WorkoutDto> UpdateAsync(UpdateWorkoutRequest request, Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        await ValidateExerciseOwnershipAsync(request.Exercises.Select(e => e.ExerciseId), userId, cancellationToken);

        var workout = await GetOwnedWorkoutAsync(id, userId, cancellationToken);

        workout.Name = request.Name;

        workout.WorkoutExercises.Clear();

        foreach (var e in request.Exercises)
        {
            var workoutExercise = new WorkoutExercise
            {
                Id = Guid.NewGuid(),
                WorkoutId = workout.Id,
                ExerciseId = e.ExerciseId,
                OrderIndex = e.OrderIndex,
                TargetSets = e.TargetSets,
                TargetReps = e.TargetReps,
                TargetWeightKg = e.TargetWeightKg,
            };

            workoutRepository.AddWorkoutExercise(workoutExercise);
        }

        await workoutRepository.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, userId, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        var workout = await GetOwnedWorkoutAsync(id, userId, cancellationToken);

        workoutRepository.Delete(workout);
        await workoutRepository.SaveChangesAsync(cancellationToken);
    }

    private async Task<Workout> GetOwnedWorkoutAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var workout = await workoutRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new WorkoutNotFoundException();
        
        if (workout.UserId != userId)
        {
            throw new WorkoutNotOwnedException();
        }

        return workout;
    }

    private async Task ValidateExerciseOwnershipAsync(
        IEnumerable<Guid> exerciseIds,
        Guid userId,
        CancellationToken cancellationToken)
    {
        var userExercises = await exerciseRepository.GetAllByUserAsync(userId, cancellationToken);
        var userExerciseIds = userExercises.Select(e => e.Id).ToHashSet();

        if (exerciseIds.Any(id => !userExerciseIds.Contains(id)))
        {
            throw new InvalidExerciseReferenceException();
        }
    }

    private static WorkoutDto ToDto(Workout workout) => new()
    {
        Id = workout.Id,
        Name = workout.Name,
        Exercises = workout.WorkoutExercises
            .OrderBy(we => we.OrderIndex)
            .Select(ToDto)
            .ToList(),
    };

    private static WorkoutExerciseDto ToDto(WorkoutExercise workoutExercise) => new()
    {
        Id = workoutExercise.Id,
        ExerciseId = workoutExercise.ExerciseId,
        ExerciseName = workoutExercise.Exercise.Name,
        OrderIndex = workoutExercise.OrderIndex,
        TargetSets = workoutExercise.TargetSets,
        TargetReps = workoutExercise.TargetReps,
        TargetWeightKg = workoutExercise.TargetWeightKg,
    };

}