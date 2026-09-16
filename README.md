# UVMP AI

AI-enabled volunteer management for disaster response and community service.

## Prerequisites

- Java 25 LTS (Java 17+ is supported by the Maven configuration)
- Maven Wrapper (`Backend/mvnw.cmd`)
- Node.js 22+
- MySQL 8+

## Run the backend

Set database and JWT values through environment variables, then run:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/uvmp?createDatabaseIfNotExist=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-password"
$env:JWT_SECRET="replace-with-a-long-random-secret"
$env:SPRING_PROFILES_ACTIVE="demo"
cd Backend
./mvnw.cmd spring-boot:run
```

For IntelliJ, open **Run > Edit Configurations**, select `UvmpApplication`, and add these environment variables before starting: `DB_USERNAME=root`, `DB_PASSWORD=<your MySQL password>`, and `JWT_SECRET=<a long random secret>`. The error `using password: NO` means `DB_PASSWORD` is missing from the run configuration.

The `demo` profile seeds one admin, one district authority, six NGOs, eighteen volunteers, ten tasks, and five incidents. The raw reference schema is in `Backend/src/main/resources/schema.sql`. Hibernate manages local development tables with `DDL_AUTO=update`; use `DDL_AUTO=validate` with the reference schema in production.

## Demo credentials

- Admin: `admin@uvmp.local` / `Admin123!`
- District: `district@uvmp.local` / `District123!`
- NGO: `ngo1@uvmp.local` / `Ngo123!`
- Volunteer: `volunteer1@uvmp.local` / `Volunteer123!`

## Run the frontend

```powershell
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The public citizen SOS form is available at `/incident-report`.

## Verification

```powershell
cd Backend
./mvnw.cmd test
cd ../Frontend
npm run lint
npm run build
```

Volunteer matching scores candidates using skill overlap (50%), Haversine proximity (30%), and normalized reliability (20%).
