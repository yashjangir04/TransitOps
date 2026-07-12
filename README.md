# TransitOps – Smart Transport Operations Platform

TransitOps is a centralized platform for managing the full lifecycle of transport
operations: vehicle registration, driver management, trip dispatching,
maintenance, fuel and expense tracking, and operational analytics.

This repository contains three parts:

- `client/` – React frontend (Create React App + Craco, Tailwind CSS, Radix UI)
- `server/` – Node.js/Express backend API with Prisma ORM
- `db/` – Docker Compose file for a local PostgreSQL database (with Adminer for
  DB inspection)

Note: in the current state of this repository, the frontend (`client/`) runs
against local mock data defined in `client/src/lib/mockData.js` and is not yet
wired up to call the backend API. The backend (`server/`) is a fully separate
Express + Prisma API that can be run and tested on its own (for example with a
tool such as Postman or curl). Keep this in mind when running the project.

---

## 1. Prerequisites

Make sure the following are installed on your machine before you start:

- Node.js (v18 or later recommended)
- npm (comes with Node.js) or Yarn, since the client uses a `yarn.lock` file
- Docker and Docker Compose (used to run the PostgreSQL database)
- Git (to clone the repository, if not already downloaded)

---

## 2. Project Structure

```
TransitOps-main/
  client/     React frontend
  server/     Express backend + Prisma
  db/         Docker Compose file for PostgreSQL + Adminer
```

---

## 3. Setting Up the Database

The backend expects a PostgreSQL database. A ready-to-use Docker Compose file
is provided in the `db/` folder.

1. Open a terminal and move into the `db` folder:

   ```
   cd db
   ```

2. Start the database container:

   ```
   docker compose up -d
   ```

   This starts two containers:
   - PostgreSQL, exposed on port `5432`, with:
     - Database name: `transitopsDB`
     - Username: `transitops`
     - Password: `transitops`
   - Adminer (a web-based database browser), available at
     `http://localhost:8080`

3. To stop the database later, run `docker compose down` from the `db` folder.

If port `5432` or `8080` is already used by another service on your machine,
either stop that service first or edit the port mapping in
`db/docker-compose.yaml`.

---

## 4. Setting Up the Backend (server)

1. Move into the server folder:

   ```
   cd server
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file inside the `server` folder with the following
   variables:

   ```
   PORT=3000
   DATABASE_URL=postgresql://transitops:transitops@localhost:5432/transitopsDB
   JWT_SECRET=replace_this_with_a_long_random_secret_string
   ```

   - `DATABASE_URL` must match the credentials used in `db/docker-compose.yaml`.
   - `JWT_SECRET` can be any long, random string; it is used to sign and verify
     login tokens.

4. Apply the database schema using Prisma:

   ```
   npx prisma migrate deploy
   ```

   If you are setting up the project for local development and want Prisma to
   manage migrations interactively instead, you can use:

   ```
   npx prisma migrate dev
   ```

5. Generate the Prisma client (this normally happens automatically with the
   commands above, but can be run manually if needed):

   ```
   npx prisma generate
   ```

6. Seed the database with default roles and demo user accounts:

   ```
   npx prisma db seed
   ```

   This creates four demo accounts, all using the password `password123`:

   - `fleetmanager@gmail.com` – Fleet Manager role
   - `dispatcher@gmail.com` – Dispatcher role
   - `safetyofficer@gmail.com` – Safety Officer role
   - `financialanalyst@gmail.com` – Financial Analyst role

7. Start the backend server:

   ```
   npm start
   ```

   The server runs on `http://localhost:3000` by default (or the port set in
   `PORT`). You should see a console message confirming the server is
   running.

### Available API Route Groups

Once running, the backend exposes the following route groups:

- `POST /api/auth/login` – log in with email and password
- `GET /api/auth/me` – get the currently authenticated user
- `/api/trips` – trip creation, dispatch, completion, cancellation
- `/api/drivers` – driver CRUD and status management
- `/api/vehicles` – vehicle CRUD and status management
- `/api/maintenance` – maintenance record management
- `/api/finance` – fuel logs and expense tracking
- `/api/analytics` – reports and analytics data

These can be tested with a tool such as Postman, Insomnia, or curl.

---

## 5. Setting Up the Frontend (client)

1. Open a new terminal and move into the client folder:

   ```
   cd client
   ```

2. Install dependencies. The project includes a `yarn.lock` file, so Yarn is
   recommended, but npm also works:

   Using Yarn:

   ```
   yarn install
   ```

   Using npm:

   ```
   npm install
   ```

3. Start the development server:

   Using Yarn:

   ```
   yarn start
   ```

   Using npm:

   ```
   npm start
   ```

4. The application will open automatically at `http://localhost:3000` in your
   browser. If the backend server from step 4 is also configured to run on
   port 3000, change the frontend port before starting it, for example:

   ```
   PORT=3001 npm start
   ```

   (On Windows PowerShell, use `$env:PORT=3001; npm start` instead.)

5. Log in using any of the demo accounts described above (for example
   `fleetmanager@gmail.com` / `password123`). As noted earlier, the current
   frontend build reads its data from local mock data rather than the live
   backend, so login and all screens will work fully offline without the
   server or database running.

---

## 6. Running the Full Project

To run everything together during development:

1. Start the database: `cd db && docker compose up -d`
2. Start the backend: `cd server && npm start`
3. Start the frontend in a separate terminal: `cd client && npm start` (or
   `yarn start`), using a different port than the backend if needed.

---

## 7. Useful Commands Reference

| Task                          | Command (run inside `server/`)      |
|-------------------------------|--------------------------------------|
| Install backend dependencies  | `npm install`                        |
| Apply migrations               | `npx prisma migrate deploy`         |
| Create/apply dev migration     | `npx prisma migrate dev`            |
| Generate Prisma client         | `npx prisma generate`               |
| Seed database                  | `npx prisma db seed`                |
| Start backend server           | `npm start`                         |

| Task                          | Command (run inside `client/`)      |
|-------------------------------|--------------------------------------|
| Install frontend dependencies | `yarn install` or `npm install`      |
| Start frontend dev server     | `yarn start` or `npm start`          |
| Build production frontend     | `yarn build` or `npm run build`      |

| Task                          | Command (run inside `db/`)          |
|-------------------------------|--------------------------------------|
| Start database + Adminer      | `docker compose up -d`               |
| Stop database + Adminer       | `docker compose down`                |

---

## 8. Troubleshooting

- **Port already in use**: Change the `PORT` value in the backend `.env` file,
  or set `PORT` when starting the frontend, or adjust port mappings in
  `db/docker-compose.yaml`.
- **Prisma cannot connect to the database**: Confirm the Docker database
  container is running (`docker ps`) and that `DATABASE_URL` in `server/.env`
  matches the credentials in `db/docker-compose.yaml`.
- **Login fails on the backend API**: Make sure you have run `npx prisma db
  seed` after migrating, so the demo accounts exist in the database.
- **JWT errors**: Ensure `JWT_SECRET` is set in `server/.env` and that the
  server was restarted after adding or changing it.
