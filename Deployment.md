# Deployment Guide

This guide provides instructions on how to deploy the different services of this Turborepo project.

## Overview

This project consists of multiple applications (apps) and shared packages. The applications are:

- `http-backend`: An Express.js server for HTTP-based communication.
- `ws-backend`: A WebSocket server for real-time communication.
- `web`: A Next.js frontend application.
- `x-draw-frontend`: Another frontend application.

The `packages` directory contains shared code that is used by these applications. Turborepo automatically handles the building of these packages when an application that depends on them is built.

## Deployment Platforms

We will be using the following platforms for deployment:

- **Render**: For the backend services (`http-backend` and `ws-backend`).
- **Vercel**: For the frontend applications (`web` and `x-draw-frontend`).

## Render Deployment

Follow these steps to deploy the backend services on Render.

### `http-backend`

1.  Create a new "Web Service" on Render.
2.  Connect your Git repository.
3.  Use the following settings:
    -   **Root Directory**: `.`
    -   **Build Command**: `pnpm install && pnpm turbo build --filter=http-backend`
    -   **Start Command**: `node apps/http-backend/dist/index.js`

### `ws-backend`

1.  Create a new "Web Service" on Render.
2.  Connect your Git repository.
3.  Use the following settings:
    -   **Root Directory**: `.`
    -   **Build Command**: `pnpm install && pnpm turbo build --filter=ws-backend`
    -   **Start Command**: `node apps/ws-backend/dist/index.js`

## Vercel Deployment

Vercel provides a seamless deployment experience for Next.js applications.

### `web`

1.  Create a new "Project" on Vercel.
2.  Connect your Git repository.
3.  When importing the project, Vercel will automatically detect that it's a Next.js application.
4.  Set the **Root Directory** to `apps/web`. Vercel will handle the rest.

### `x-draw-frontend`

1.  Create a new "Project" on Vercel.
2.  Connect your Git repository.
3.  When importing the project, Vercel will automatically detect that it's a Next.js application.
4.  Set the **Root Directory** to `apps/x-draw-frontend`. Vercel will handle the rest.

## Environment Variables

You need to configure the following environment variables on the respective deployment platforms.

### Render (`http-backend` and `ws-backend`)

-   `JWT_SECRET`: A long, random string used to sign and verify JSON Web Tokens. This should be the same for both `http-backend` and `ws-backend`.
-   `PORT`: The port on which the services will run. Render sets this automatically, so you usually don't need to set it manually.

### Vercel (`x-draw-frontend`)

-   `NEXT_PUBLIC_HTTP_BACKEND_URL`: The public URL of your deployed `http-backend` service on Render (e.g., `https://your-http-backend.onrender.com`).
-   `NEXT_PUBLIC_WS_BACKEND_URL`: The public URL of your deployed `ws-backend` service on Render, using the `wss` protocol (e.g., `wss://your-ws-backend.onrender.com`).