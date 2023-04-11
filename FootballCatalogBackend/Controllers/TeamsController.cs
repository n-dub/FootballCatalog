using System.ComponentModel.DataAnnotations;
using FootballCatalogBackend.Data;
using FootballCatalogBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FootballCatalogBackend.Controllers;

[ApiController]
[Route("/api/[controller]/[action]")]
public class TeamsController : ControllerBase
{
    private readonly AppDataContext dataContext;
    private readonly ILogger<TeamsController> logger;

    public TeamsController(ILogger<TeamsController> logger, AppDataContext dataContext)
    {
        this.logger = logger;
        this.dataContext = dataContext;
    }

    [HttpPost]
    public async Task<IActionResult> Create(string teamName)
    {
        logger.LogInformation("Received request to create team: {}", teamName);

        if (dataContext.Teams.Any(t => t.Name == teamName))
        {
            return BadRequest(new { Message = "Team name must be unique" });
        }

        var entry = await dataContext.Teams.AddAsync(new FootballTeam { Id = 0, Name = teamName });
        await dataContext.SaveChangesAsync();
        return Ok(entry.Entity.Id);
    }

    [HttpGet]
    public async Task<IActionResult> Search(string pattern, [Required, Range(0, 32)] int maxCount)
    {
        logger.LogInformation("Received request to get teams starting with {}", pattern);

        var lowerPattern = pattern.ToLower();
        var result = await dataContext.Teams
            .AsNoTracking()
            .Where(team => team.Name.ToLower().StartsWith(lowerPattern))
            .OrderBy(team => team.Name)
            .Take(maxCount)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> Get(int id)
    {
        var result = await dataContext.Teams
            .FirstOrDefaultAsync(team => team.Id == id);

        if (result is null)
        {
            return NotFound(new { Message = $"Team with id {id} was not found" });
        }

        return Ok(result.Name);
    }
}
