using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Fithub.Infrastructure.Dtos;
using Fithub.Infrastructure.Services.Schedules;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fithub.Api.Controllers;

[ApiController]
[Route("schedules")]
[Authorize]
public class ScheduleController(IScheduleService scheduleService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ScheduleDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await scheduleService.GetAllAsync(GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ScheduleDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var result = await scheduleService.GetByIdAsync(id, GetUserId(), cancellationToken);
            return Ok(result);
        }
        catch (ScheduleNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ScheduleNotOwnedException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ScheduleDto>> Create(CreateScheduleRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await scheduleService.CreateAsync(request, GetUserId(), cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidDayOfWeekException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidWorkoutReferenceException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ScheduleDto>> Update(Guid id, UpdateScheduleRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await scheduleService.UpdateAsync(request, id, GetUserId(), cancellationToken);
            return Ok(result);
        }
        catch (ScheduleNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ScheduleNotOwnedException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
        catch (InvalidDayOfWeekException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidWorkoutReferenceException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await scheduleService.DeleteAsync(id, GetUserId(), cancellationToken);
            return NoContent();
        }
        catch (ScheduleNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ScheduleNotOwnedException ex)
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