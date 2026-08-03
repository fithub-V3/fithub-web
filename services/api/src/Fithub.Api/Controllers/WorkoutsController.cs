using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Services.Exercises;
using Fithub.Infrastructure.Services.Workouts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fithub.Api.Controllers;

[ApiController]
[Route("workouts")]
[Authorize]
public class WorkoutsController(IWorkoutService workoutService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<WorkoutDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await workoutService.GetAllAsync(GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var result = await workoutService.GetByIdAsync(id, GetUserId(), cancellationToken);
            return Ok(result);
        }
        catch (WorkoutNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (WorkoutNotOwnedException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutDto>> Create(CreateWorkoutRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await workoutService.CreateAsync(request, GetUserId(), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidExerciseReferenceException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WorkoutDto>> Update(Guid id, UpdateWorkoutRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await workoutService.UpdateAsync(request, id, GetUserId(), cancellationToken);
            return Ok(result);
        }
        catch (WorkoutNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (WorkoutNotOwnedException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
        catch (InvalidExerciseReferenceException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await workoutService.DeleteAsync(id, GetUserId(), cancellationToken);
            return NoContent();
        }
        catch (WorkoutNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (WorkoutNotOwnedException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                      ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(idClaim!);
    }
}