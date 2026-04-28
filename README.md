# MyGamingList

Track all your games - what you played, what you're playing, what you're wishing, your favorites and even the ones you hated.

## Tech Stack

[![Live Demo](https://img.shields.io/badge/Live%20Demo-online-brightgreen?style=for-the-badge)](https://mygaminglist-ielz.onrender.com)
![.NET](https://img.shields.io/badge/.NET%208-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)


<img width="879" height="454" alt="Login screen with dynamic background" src="https://github.com/user-attachments/assets/21ae5cc1-a4ad-44a2-a06d-9c1bd5db549b" />



## About
MyGamingList is a full-stack web application that lets you manage your personal game library. Search any game, add it to your list, set its status, and mark your favorites — all in one place.
Game data is powered by the RAWG API, one of the largest video game databases available.



## Features

🔍 Game Search — search from a database of hundreds of thousands of games via RAWG API
📋 Game List — add games and track their status: Playing, Completed, Paused, Dropped, or Wishlist
⭐ Favorites — mark your most loved games and access them quickly
📊 Profile Dashboard — see your stats at a glance (total games, completed, wishlist, favorites)
🏠 Home Page — browse Upcoming and New Releases, and discover new games
🔐 Authentication — secure register and login with JWT stored in HttpOnly cookies
🎨 Dynamic Login Background — login page background changes on every visit

---

## Screenshots

Home

<img width="1845" height="914" alt="Home page" src="https://github.com/user-attachments/assets/1727485d-02f0-4b9b-bbc1-aa09d23b3073" />


Game List

<img width="1846" height="927" alt="Game list" src="https://github.com/user-attachments/assets/63e6c707-5e8f-426a-af8b-005031994dbd" />


Profile

<img width="1250" height="498" alt="Profile dashboard" src="https://github.com/user-attachments/assets/bff6bf62-d9a0-4d9e-97ba-43d6bdfa8bd1" />

---

## Tech Stack


Backend

.NET 8 / ASP.NET Core Web API
Entity Framework Core
ASP.NET Core Identity
JWT Authentication (HttpOnly cookie via Next.js API route)
PostgreSQL (Neon)

Frontend

Next.js 14 (App Router)
TypeScript
Tailwind CSS
RAWG API

Infrastructure

Render (backend + frontend)
Neon (PostgreSQL)
UptimeRobot (uptime monitoring)

---

## Live Demo

The project is fully deployed and ready to use:

**[https://mygaminglist-ielz.onrender.com](https://mygaminglist-ielz.onrender.com)**

> ⚠️ Hosted on Render's free tier — the backend may take ~30 seconds to wake up on the first request.
> ⚠️ PostgreSQL is hosted on Neon and the most heavy stuff from the application may have some lag due to servers beign too far away from each other.
> ⚠️ On the first visit after being logged in, authentication state may not load correctly due to cold start latency — a quick refresh fixes it (I'll work on it!).
