# Entertainment AI

A full-stack movie and television discovery application. Users can create an account, save a personal favorites list, open detailed TMDB information, and request a simple spoiler-free Gemini summary. Generated summaries are stored in PostgreSQL and reused for future viewers.

## Structure

```text
Entertainment-App/
├── Movie/                  React and Vite frontend
│   └── src/
│       ├── components/     Cards, navigation, and the detail drawer
│       ├── contexts/       Authentication, favorites, and selected-title state
│       ├── pages/          Route-level screens
│       ├── services/       Backend API client
│       └── css/            Component styles and shared theme
└── server/                 Node.js and Express backend
    └── src/
        ├── config/         Environment configuration
        ├── db/             PostgreSQL pool and schema initialization
        ├── middleware/     JWT authentication
        ├── routes/         Auth, favorites, movie, and summary endpoints
        └── services/       TMDB and Gemini integrations
```

## Local setup

Create a PostgreSQL database named `entertainment_app`. Then configure and start the API:

```bash
cd server
cp .env.example .env
# Add the PostgreSQL URL, JWT secret, TMDB key, and Gemini key to .env
npm install
npm run dev
```

In another terminal, start the frontend:

```bash
cd Movie
cp .env.example .env
npm install
npm run dev
```

The backend creates the `users`, `favorites`, and `ai_summaries` tables when it starts. API credentials belong only in `server/.env` or a cloud secret manager; they must never be placed in the React environment.

## Summary cache

`GET /api/movies/:mediaType/:externalId/summary` fetches title details from TMDB and hashes the title, overview, and genres. The service returns an existing PostgreSQL summary when the media ID, source hash, and prompt version match. Otherwise it calls Gemini, saves the result, and returns `cached: false`.
