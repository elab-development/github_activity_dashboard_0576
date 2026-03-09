# GitHub Activity Dashboard

Full-stack web application for tracking public GitHub repository activity such as commits, issues, pull requests and branches.

## Tech Stack

Frontend:

- Next.js
- React
- Tailwind CSS
- Recharts

Backend:

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication

External APIs:

- GitHub REST API
- GitHub GraphQL API

## Features

- User registration and login
- JWT authentication
- Role based access (ADMIN, ANALYST, VIEWER)
- Add and track GitHub repositories
- Synchronize repository activity
- View commits, issues, pull requests and branches
- Activity timeline
- Dashboard analytics
- Analyst advanced insights (GraphQL)
- Swagger API documentation

## User Roles

ADMIN

- manage repositories
- view all activity

ANALYST

- view analytics dashboard
- repository insights

VIEWER

- view tracked repositories and activity

## External APIs

### GitHub REST API

Used to fetch:

- commits
- issues
- pull requests
- branches

### GitHub GraphQL API

Used to fetch:

- stars
- forks
- watchers
- open issues
- open pull requests
- primary language
- default branch

## Local setup

### Backend

Create `backend/.env` manually and add:

```env
DATABASE_URL="postgresql://postgres:5678@localhost:5432/github_dashboard?schema=public"
JWT_SECRET="super-secret-key"
PORT=4000
GITHUB_TOKEN="your-github-token"
```
