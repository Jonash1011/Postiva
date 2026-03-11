# Postiva — Secure Blog Platform

Postiva is a full-stack blog platform designed with a clean and scalable architecture.
It allows users to create blogs, view a public feed, interact through likes and comments, and includes modern features such as authentication, AI assistance, and secure password recovery.

The system was designed with production-grade backend architecture, optimized database queries, and a modern frontend UI.

---

# Live Application

Frontend
https://postiva.vercel.app

Backend API
https://postiva-sf7e.onrender.com

Repository
https://github.com/Jonash1011/Postiva

---

# Tech Stack

## Frontend

* Next.js 15 (App Router)
* TypeScript
* TailwindCSS
* Modern component architecture

## Backend

* NestJS
* TypeScript
* Prisma ORM
* JWT Authentication

## Database

* PostgreSQL (Supabase)

## AI Integration

* Google Gemini API

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: Supabase

---

# System Architecture

The application follows a layered architecture to ensure maintainability and scalability.

Client (Next.js Frontend)
↓
REST API (NestJS Backend)
↓
Prisma ORM
↓
PostgreSQL Database

This separation allows each layer to scale independently.

Frontend is responsible for UI rendering and API interaction.
Backend manages authentication, business logic, and database operations.
Database stores persistent application data.

---

# Backend Architecture

The backend is organized using NestJS modular architecture.

src
modules
auth
blogs
comments
likes
users
ai
mail

Each module encapsulates its own controllers, services, and DTOs.

Key design decisions:

* Modular design improves maintainability
* DTO validation ensures secure input handling
* Prisma ORM enables type-safe database queries
* JWT authentication protects private routes

---

# Database Design

Main entities:

User
Blog
Like
Comment

Relationships:

User → Blogs
User → Likes
User → Comments
Blog → Comments
Blog → Likes

Database constraints prevent duplicate likes and ensure data integrity.

Indexes were added for commonly queried fields to improve performance.

---

# Authentication System

The authentication system is implemented using JWT.

Features:

* User registration
* Login with password hashing (bcrypt)
* JWT token generation
* Protected routes with guards
* Secure error responses

Additional security features:

* OTP based password reset
* Email verification for password recovery
* Token based authorization

---

# Blog Management

Authenticated users can:

Create blogs
Edit blogs
Delete blogs

Each blog includes:

Title
Content
Slug
Publication status

The slug field is unique and enables public blog URLs.

Example public route:

/blog/{slug}

---

# Public Feed

The public feed returns a paginated list of published blogs.

Features:

* Pagination support
* Sorted by newest first
* Includes author info
* Includes like and comment counts

Optimized Prisma queries were used to avoid N+1 query problems.

---

# Like System

Users can like blog posts.

Rules implemented:

* A user can like a post only once
* Database constraint prevents duplicates
* Like count updates dynamically

---

# Comment System

Users can comment on blog posts.

Features:

* Real-time UI updates
* Author information included
* Sorted by newest first

Database indexes improve comment retrieval performance.

---

# AI Blog Assistant

An AI assistant was integrated using the Gemini API.

Capabilities:

* Blog summarization
* Content explanation
* Tag suggestions
* Writing assistance

This improves user experience and demonstrates product innovation.

---

# Security Considerations

Security was a key focus of the architecture.

Implemented measures:

* Password hashing using bcrypt
* JWT token validation
* Input validation with DTOs
* Rate-limited authentication endpoints
* Protected blog modification routes
* OTP-based password reset

Sensitive environment variables are stored securely in deployment environments.

---

# Deployment Architecture

Frontend is deployed on Vercel.

Backend is deployed on Render.

Database is hosted on Supabase PostgreSQL.

This setup provides separation of concerns and easy scalability.

Client (Vercel)
↓
Backend API (Render)
↓
PostgreSQL Database (Supabase)

---

# Scaling Strategy (1M Users)

To scale the system for high traffic, the following improvements would be implemented.

API Scaling

* Deploy backend with horizontal scaling
* Use container orchestration (Docker + Kubernetes)

Database Scaling

* Introduce read replicas
* Implement connection pooling

Caching Layer

* Use Redis for caching popular blog feeds
* Cache like and comment counts

Content Delivery

* Serve static assets via CDN

Background Jobs

* Use queue systems (BullMQ + Redis)
* Handle tasks like notifications and summaries asynchronously

Monitoring

* Use logging tools such as Pino
* Integrate monitoring systems (Prometheus / Grafana)

---

# Tradeoffs and Decisions

Several design decisions were made balancing development speed and scalability.

NestJS was chosen because it provides structured architecture and dependency injection.

Prisma ORM simplifies database management while maintaining type safety.

Next.js enables server-side rendering and fast frontend performance.

Gemini API was selected for AI integration due to its accessibility and free tier availability.

---

# Future Improvements

Potential enhancements include:

* Real-time notifications
* Advanced search functionality
* Blog analytics dashboard
* Content recommendation engine
* WebSocket based live updates

---

# Setup Instructions

Clone the repository

git clone https://github.com/Jonash1011/Postiva.git

Backend setup

cd backend
npm install
npm run start:dev

Frontend setup

cd frontend
npm install
npm run dev

---

# Author

Jonash P
Software Developer
