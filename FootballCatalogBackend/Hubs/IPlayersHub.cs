using FootballCatalogBackend.Models;

namespace FootballCatalogBackend.Hubs;

public interface IPlayersHub
{
    Task PlayerAdded(FootballPlayer player);
    Task PlayerUpdated(FootballPlayer player);
}
