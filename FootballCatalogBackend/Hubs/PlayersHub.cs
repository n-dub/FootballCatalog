using FootballCatalogBackend.Models;
using Microsoft.AspNetCore.SignalR;

namespace FootballCatalogBackend.Hubs;

public sealed class PlayersHub : Hub<IPlayersHub>
{
    public async Task PlayerAdded(FootballPlayer player)
    {
        await Clients.All.PlayerAdded(player);
    }

    public async Task PlayerUpdated(FootballPlayer player)
    {
        await Clients.All.PlayerUpdated(player);
    }
}
