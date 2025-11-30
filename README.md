# Daily Todo App 📝

A **Monorepo** full-stack application for managing daily tasks.
**Key Feature:** All tasks automatically reset at midnight (00:00).

## 🛠 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), TailwindCSS, Zod |
| **Backend** | Express.js, MongoDB Atlas |
| **Security** | Argon2 (Hashing), JWT (HTTP-only Cookies) |
| **Core** | **Protobuf** (Schema), **TurboRepo** (Build System), Docker |

## 📂 Structure

```text
.
├── backend                 # Express API Server
│   ├── src
│   │   ├── config          # Environment config
│   │   ├── controllers     # Request handlers (Auth, Todo, Home)
│   │   ├── models          # Mongo models
│   │   ├── router          # API Routes definition
│   │   ├── views           # View logic
│   │   └── server.ts       # Entry point
│   └── package.json
├── frontend                # React Client
│   ├── src
│   │   ├── lib             # Shared components & schemas
│   │   ├── pages           # Route pages (Home, Login, Signup)
│   │   └── router          # React Router configuration
│   └── vite.config.ts
├── protobuf/        # .proto definitions
├── turbo.json       # Monorepo pipeline
└── Dockerfile       # Container setup
```

## ⚡ Quick Start

1. Setup & Run

``` bash
# Clone & Install
git clone <your-repo-url>
cd daily-todo-app
npm install
# Run Dev Server (Starts both Client & Server via Turbo)
npm run dev
```

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:4000>

1. Configuration create backend/.env with your MongoDB credentials:

```bash
MONGOURI=mongodb+srv://user:pass@cluster.mongodb.net/db?w=majority
JWT_SECRET=your_secret_key || random
```

## 🐳 Docker

Run the entire app in a container:

```bash
docker build -t daily-todo-app .
docker run -dp 4000:4000 -e MONGOURI="<your_mongo_uri>" daily-todo-app
```
