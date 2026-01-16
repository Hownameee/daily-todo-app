# Daily Todo App 📝

> **🔴 Live Demo:** [daily-todo.app](https://daily-todo.apn.leapcell.app)

A **Monorepo** full-stack application for managing daily tasks.
**Key Feature:** All tasks automatically reset at midnight (00:00).

## 🛠 Tech Stack

| Domain       | Technologies                                                |
| :----------- | :---------------------------------------------------------- |
| **Frontend** | React (Vite), TailwindCSS, Zod                              |
| **Backend**  | Express.js, MongoDB Atlas                                   |
| **Security** | Argon2 (Hashing), JWT (HTTP-only Cookies)                   |
| **Core**     | **Protobuf** (Schema), **TurboRepo** (Build System), Docker |

## 📂 Structure

```text
.
├── backend                 # Express API Server
│   ├── src
│   │   ├── config          # Environment configuration
│   │   ├── controllers     # Request handlers & generated proto types
│   │   ├── db              # Mongoose connection setup
│   │   ├── middlewares     # Error handling, Auth, & Proto parsing
│   │   ├── models          # Mongoose data models & interfaces
│   │   ├── router          # Express route definitions
│   │   ├── schema          # Zod validation schemas
│   │   ├── services        # Business logic & DB abstraction layers
│   │   ├── views           # Static file serving logic
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   └── package.json
├── frontend                # React Client
│   ├── src
│   │   ├── assets          # Global styles & images
│   │   ├── lib
│   │   │   ├── components  # Reusable UI components
│   │   │   ├── Context     # React Context (Theme)
│   │   │   └── schema      # Zod validation schemas
│   │   ├── pages           # Route pages (Home, Login, Signup)
│   │   └── router          # React Router configuration
│   └── vite.config.ts
├── protobuf/               # Protocol Buffer definitions (.proto)
├── turbo.json              # Monorepo pipeline configuration
└── Dockerfile              # Container deployment setup
```

## ⚡ Quick Start

1. Setup & Run

```bash
# Clone & Install
git clone <your-repo-url>
cd daily-todo-app
npm install
# Run Dev Server (Starts both Client & Server via Turbo)
npm run dev
```

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:4000>

2. Configuration create backend/.env with your MongoDB credentials:

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
