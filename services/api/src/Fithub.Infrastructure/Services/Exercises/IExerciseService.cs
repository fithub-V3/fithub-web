using Fithub.Infrastructure.Dtos;

namespace Fithub.Infrastructure.Services.Exercises;

public interface IExerciseService
{
    Task<List<ExerciseDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ExerciseDto> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<ExerciseDto> CreateAsync(CreateExerciseRequest request, Guid userId, CancellationToken cancellationToken = default);
    Task<ExerciseDto> UpdateAsync(UpdateExerciseRequest request, Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
}