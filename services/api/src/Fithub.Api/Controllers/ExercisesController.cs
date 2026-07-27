using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Services.Exercises;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fithub.Api.Controllers;

[ApiController]
[Route("exercises")]
[Authorize]
public class ExerciseController(IExerciseService exerciseService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ExerciseDto>>> GetAll(CancellationToken cancellationToken)
    {
        // This get method calls the service, which calls the repository, which is where the filtering by user id is done
        var result = await exerciseService.GetAllAsync(GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExerciseDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var result = await exerciseService.GetByIdAsync(id, GetUserId(), cancellationToken);
            return Ok(result);
        }
        catch (ExerciseNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ExerciseNotOwnedException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ExerciseDto>> Create(CreateExerciseRequest request, CancellationToken cancellationToken)
    {
        var result = await exerciseService.CreateAsync(request, GetUserId(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ExerciseDto>> Update(Guid id, UpdateExerciseRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await exerciseService.UpdateAsync(request, id, GetUserId(), cancellationToken);
            return Ok(result);
        }
        catch (ExerciseNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ExerciseNotOwnedException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await exerciseService.DeleteAsync(id, GetUserId(), cancellationToken);
            return NoContent();
        }
        catch (ExerciseNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ExerciseNotOwnedException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                      ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(idClaim);
    }
}