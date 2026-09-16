using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Entities;
using Fithub.Infrastructure.Services.WorkoutLogs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fithub.Api.Controllers;

[ApiController]
[Route("workout-logs")]
[Authorize]
public class WorkoutLogsController(IWorkoutLogService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<WorkoutLogDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await service.GetAllAsync(GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutLogDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var result = await service.GetByIdAsync(id, GetUserId(), cancellationToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutLogDto>> Create(CreateWorkoutLogRequest request, CancellationToken cancellationToken)
    {
        var result = await service.CreateAsync(request, GetUserId(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await service.DeleteAsync(id, GetUserId(), cancellationToken);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status400BadRequest, new { message = ex.Message });
        }
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                        ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(idClaim);
    }
}