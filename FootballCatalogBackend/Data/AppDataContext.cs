using FootballCatalogBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballCatalogBackend.Data;

public sealed class AppDataContext : DbContext
{
    public required DbSet<FootballPlayer> Players { get; set; }
    
    public required DbSet<FootballTeam> Teams { get; set; }

    public AppDataContext(DbContextOptions<AppDataContext> options)
        : base(options)
    {
    }
}
