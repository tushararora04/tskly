# tskly

A real-time, AI-powered task board inspired by Trello — built with the MERN stack, Socket.io for live collaboration, and Google Gemini for AI-assisted task creation.

**Live demo:** https://tskly-frontend-beta.vercel.app
**Backend repo:** https://github.com/tushararora04/tskly-backend
**Frontend repo:** https://github.com/tushararora04/tskly-frontend

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after a period of inactivity may take 30-60 seconds to respond while the server wakes up.

## Overview

tskly lets users create boards, organize work into columns, and manage tasks as draggable cards — similar to Trello. What sets it apart is real-time multiplayer sync via WebSockets and two AI-assisted workflows powered by Google's Gemini API: natural language card creation and automatic task breakdown.

Register an account on the live demo to try it out.

## Features

- **Authentication** — JWT-based register/login, protected routes
- **Boards, columns, and cards** — full CRUD, nested data fetched in a single request via Mongoose population
- **Drag and drop** — reorder cards within a column or move them across columns, built with `@dnd-kit`
- **Real-time sync** — changes made by one user appear instantly for everyone viewing the same board, via Socket.io rooms scoped per board
- **AI Quick Add** — type a task in plain English (e.g. "fix login bug by friday, high priority") and the AI extracts a structured card with title, priority, and due date
- **AI Task Breakdown** — describe a large task and the AI splits it into 4-7 actionable sub-task cards, added directly to the column
- **Priority levels and due dates** — with visual indicators for overdue cards
- **Dark mode UI** — built with Tailwind CSS and animated with Framer Motion

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- Zustand (state management)
- @dnd-kit (drag and drop)
- Socket.io Client
- Axios
- React Router

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.io
- JWT (jsonwebtoken) + bcryptjs
- Google Gemini API (`@google/genai`)

**Infrastructure**
- MongoDB Atlas (database)
- Render (backend hosting)
- Vercel (frontend hosting)

## Architecture

```
Client (React + Vite)
   |
   |-- REST API (Axios) -----> Express server -----> MongoDB Atlas
   |                                |
   |-- WebSocket (Socket.io) <------|
                                     |
                                     -----> Google Gemini API
```

Each board acts as a Socket.io "room." When a client opens a board, it joins that board's room; any card or column change on the backend is broadcast only to clients in that room, keeping updates scoped and efficient.

For AI features, the backend builds a structured prompt from the user's plain-text input, sends it to Gemini, and parses the model's JSON response into the shape the card/column creation logic already expects — so AI-generated cards go through the same validation and real-time broadcast path as manually created ones.

## Running Locally

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string (or local MongoDB instance)
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/apikey))

### Backend setup

```bash
git clone https://github.com/tushararora04/tskly-backend.git
cd tskly-backend
npm install
```

Create a `.env` file in the root with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### Frontend setup

```bash
git clone https://github.com/tushararora04/tskly-frontend.git
cd tskly-frontend
npm install
```

Create a `.env` file in the root with:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Get the current authenticated user |
| GET/POST | `/api/boards` | List or create boards |
| GET/PUT/DELETE | `/api/boards/:id` | Fetch, update, or delete a board (with nested columns/cards) |
| POST | `/api/columns` | Create a column |
| PUT/DELETE | `/api/columns/:id` | Update or delete a column |
| POST | `/api/cards` | Create a card |
| PUT/DELETE | `/api/cards/:id` | Update or delete a card |
| POST | `/api/cards/move` | Move a card between/within columns |
| POST | `/api/ai/parse-task` | Convert natural language into a structured card |
| POST | `/api/ai/breakdown` | Break a large task into sub-task cards |

All routes except register/login require a `Authorization: Bearer <token>` header.

## What I'd Improve Next

- Board collaborators (invite other users to a shared board)
- Activity log / audit trail per board
- Rate limiting on the AI endpoints
- Optimistic UI updates instead of refetching the full board on every socket event
