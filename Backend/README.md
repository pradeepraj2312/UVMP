# UVMP Backend

Spring Boot 4 REST API backed by MySQL and Spring Data JPA.

## Run locally

Create the database once:

```sql
CREATE DATABASE uvmp_db;
```

Start the application from `Backend`:

```bash
./mvnw spring-boot:run
```

On Windows use `mvnw.cmd`. The default connection is `root` with an empty password. Override it with `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JPA_DDL_AUTO` environment variables.

## API

All responses are JSON. Login and registration return a JWT. Send it on protected requests as `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Service health check |
| POST | `/api/auth/register` | Public | Create volunteer, NGO, or district authority account |
| POST | `/api/auth/login` | Public | Authenticate and receive JWT |
| POST | `/api/incidents` | Public | Submit detailed incident or SOS report |
| GET | `/api/incidents/track/{referenceId}` | Public | Track a submitted report |
| GET | `/api/incidents` | Admin/authority | List incidents |
| PATCH | `/api/incidents/{referenceId}/status` | Admin/authority | Verify or resolve an incident |
| GET | `/api/users?role=VOLUNTEER` | Admin/authority/NGO | List users by role |
| GET | `/api/tasks/mine` | Volunteer | List assigned tasks |
| POST | `/api/tasks` | Admin/authority/NGO | Create and optionally assign a task |
| PATCH | `/api/tasks/{id}/status` | Authenticated | Update task status |

Registration role values are `VOLUNTEER`, `NGO`, and `DISTRICT_AUTHORITY`. `ADMIN` is intentionally not self-registerable.

## Frontend

The Vite app runs at `http://localhost:5173`, which is allowed by the backend CORS configuration. Replace the current local sample-state handlers with requests to `http://localhost:8080/api` and persist the returned token for protected dashboard requests.

Tests use an in-memory H2 database and do not require MySQL:

```bash
./mvnw test
```