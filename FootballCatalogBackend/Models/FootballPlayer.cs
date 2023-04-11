using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace FootballCatalogBackend.Models;

[Index(nameof(TeamId))]
public sealed class FootballPlayer
{
    [Key]
    public int Id { get; set; }

    [RegularExpression(@"^[\p{L}\-']+$")]
    [StringLength(64)]
    public string Name { get; set; } = null!;

    [RegularExpression(@"^[\p{L}\-']+$")]
    [StringLength(64)]
    public string LastName { get; set; } = null!;

    public Gender Gender { get; set; }
    public DateOnly Birthday { get; set; }
    public Country Country { get; set; }

    public int TeamId { get; set; }
    public FootballTeam? Team { get; set; }
}
