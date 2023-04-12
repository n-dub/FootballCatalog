Запустить можно через docker-compose:
```sh
docker compose up --build
```

Или по отдельности:

Запуск бэкенда:
```sh
dotnet user-secret set "ConnectionStrings:CatalogDatabase" "Host=localhost;Port=5432;Database=catalog-db;Username=postgres;Password=<psql-password>"
dotnet ef database update
dotnet run
```

Запуск фронтенда:
```sh
npm i
npm start
```
