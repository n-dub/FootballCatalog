FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["FootballCatalogBackend/FootballCatalogBackend.csproj", "FootballCatalogBackend/"]
RUN dotnet restore "FootballCatalogBackend/FootballCatalogBackend.csproj"
COPY . .
WORKDIR "/src/FootballCatalogBackend"
RUN dotnet build "FootballCatalogBackend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FootballCatalogBackend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FootballCatalogBackend.dll"]
