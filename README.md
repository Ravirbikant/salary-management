# SalaryIQ — Salary Management Tool

A full-stack salary management application for HR managers to manage employees and view salary insights.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Material UI
- **Backend:** Node.js, Express, SQLite (better-sqlite3)
- **Testing:** Jest + Supertest (backend), Vitest + React Testing Library (frontend)

## Getting Started

### Prerequisites
- Node.js v18+

### Backend Setup
```bash
cd backend
npm install
npm run migrate
npm run seed
npm start
```

Backend runs on http://localhost:3001

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

### Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

## Features

### Employee Management
- Add, edit, delete employees
- Search by name, job title or country
- Paginated table (50 rows per page)

### Salary Insights
- Min, max, average salary by country
- Average salary by job title and country
- Department breakdown with employee count
- Total employees per country

## Seeding
The seed script generates 10,000 employees using first and last name combinations:
```bash
cd backend
npm run seed
```