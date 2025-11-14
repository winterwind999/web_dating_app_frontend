# Matchy — Frontend for the Dating Web Application

## Tech Stack

- **Next.js** — Full stack react framework for building fast, scalable web applications
- **Zustand** — Lightweight and intuitive state management for global app state
- **Zod** — Type-safe schema validation for forms and API data
- **React Hook Form** — Performant and flexible form state management
- **shadcn/ui** — Modern and customizable UI component library

## Project Setup

### Install Dependencies

```bash
  npm install
```

### Compile and Hot-Reload for Development

```bash
  npm run dev
```

### Compile and Minify for Production

```bash
  npm run build
  npm run start
```

## Docker Setup

### Prerequisites

- Docker installed on your machine
- Docker Compose installed
- `.env` file configured with required environment variables

### Development Environment

#### Build and Run with Docker Compose

```bash
docker-compose build

docker-compose up

docker-compose up --build

docker-compose up -d

docker-compose logs -f

docker-compose down
```

#### Build Development Image Manually

```bash
docker build -t web_dating_app_frontend:dev -f Dockerfile .

docker run -p 3500:3500 --env-file .env web_dating_app_frontend:dev
```

### Production Environment

#### Build and Run with Docker Compose

```bash
docker-compose -f docker-compose.prod.yml build

docker-compose -f docker-compose.prod.yml up

docker-compose -f docker-compose.prod.yml up --build

docker-compose -f docker-compose.prod.yml up -d

docker-compose -f docker-compose.prod.yml logs -f

docker-compose -f docker-compose.prod.yml down
```

#### Build Production Image Manually

```bash
docker build -t web_dating_app_frontend:prod -f Dockerfile.prod .

docker run -p 3500:3500 --env-file .env web_dating_app_frontend:prod
```

### Docker Network Setup

Before running the containers, ensure the external network exists:

```bash
docker network create web_network

docker network ls
```

## Legend

| Symbol | Meaning                       |
| :----- | :---------------------------- |
| ✅     | **Complete**                  |
| ⚠️     | **Partially Done**            |
| ⏳     | **In Progress / Not Started** |

## Current Progress

- ✅ Landing page
- ✅ Login module
- ✅ Setup handling of JWT, CSRF, and CORS
- ✅ Setup Role-based access control
- ✅ Sign Up module
- ⚠️ Google login
- ⚠️ Google sign up
- ✅ User profile module
- ✅ User feeds module (swiping left and right of profile)
- ✅ Chats module
- ✅ Upload of photo and albums
- ✅ Block and report module
- ✅ Notifications module
- ⏳ Forgot Password
- ⏳ Admin modules
- ✅ Dockerize frontend
- ✅ Setup GitHub Actions
- ✅ Setup Docker Hub
- ✅ Deploy to Render

## License

© 2025 Jordan G. Faciol. All rights reserved.

This source code is made publicly available for viewing purposes only.  
You may not copy, modify, distribute, or use this code in any form  
without explicit written permission from the author.
