Запуск бэкенда:
```sh
dotnet user-secret add "ConnectionStrings:CatalogDatabase" "Host=localhost;Port=5432;Database=catalog-db;Username=postgres;Password=<psql-password>"
dotnet run
```

Запуск фронтенда:
```sh
npm i
npm start
```
