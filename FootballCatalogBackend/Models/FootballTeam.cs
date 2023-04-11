using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace FootballCatalogBackend.Models;

[Index(nameof(Name), IsUnique = true)]
public sealed class FootballTeam
{
    [Key]
    public int Id { get; set; }
    [StringLength(64)]
    public string Name { get; set; } = null!;

    [JsonIgnore]
    public ICollection<FootballPlayer> Players { get; set; } = null!;
}
