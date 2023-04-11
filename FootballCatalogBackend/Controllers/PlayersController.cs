using System.ComponentModel.DataAnnotations;
using FootballCatalogBackend.Data;
using FootballCatalogBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FootballCatalogBackend.Controllers;

[ApiController]
[Route("/api/[controller]/[action]")]
public class PlayersController : ControllerBase
{
    private readonly AppDataContext dataContext;
    private readonly ILogger<PlayersController> logger;

    public PlayersController(ILogger<PlayersController> logger, AppDataContext dataContext)
    {
        this.logger = logger;
        this.dataContext = dataContext;
    }

    [HttpPost]
    public async Task<IActionResult> Create(FootballPlayer player)
    {
        var entry = await dataContext.Players.AddAsync(player);
        await dataContext.SaveChangesAsync();
        return Ok(entry.Entity.Id);
    }

    [HttpPost]
    public async Task<IActionResult> Update(FootballPlayer player)
    {
        var entry = await dataContext.Players
            .FirstOrDefaultAsync(p => p.Id == player.Id);

        if (entry is null)
        {
            return NotFound(new { Message = $"Player with id {player.Id} was not found" });
        }

        entry.Name = player.Name;
        entry.LastName = player.LastName;
        entry.Gender = player.Gender;
        entry.Birthday = player.Birthday;
        entry.TeamId = player.TeamId;
        entry.Country = player.Country;
        await dataContext.SaveChangesAsync();

        return Ok(entry);
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await dataContext.Players
            .AsNoTracking()
            .Include(p => p.Team)
            .OrderBy(p => p.Name)
            .ThenBy(p => p.LastName)
            .ToListAsync();

        return Ok(result);
    }
}
