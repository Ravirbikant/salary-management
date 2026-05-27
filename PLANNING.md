# Planning & Architecture

## Problem Understanding
Build a salary management tool for an HR Manager to:
1. Manage 10,000 employees (CRUD)
2. View salary insights by country, job title, and department

## Architecture
Frontend (React + Vite)     →     Backend (Express)     →     Database (SQLite)

## Database Schema
```sql
employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  country TEXT NOT NULL,
  salary REAL NOT NULL,
  department TEXT,
  email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

Separated first_name and last_name (instead of full_name) for better filtering and sorting flexibility.

## API Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | /employees | Get all employees |
| GET | /employees/:id | Get single employee |
| POST | /employees | Create employee |
| PUT | /employees/:id | Update employee |
| DELETE | /employees/:id | Delete employee |
| GET | /insights/country/:country | Min/max/avg by country |
| GET | /insights/jobtitle | Avg salary by job title + country |
| GET | /insights/department | Department breakdown by country |

## Key Decisions & Tradeoffs

### SQLite over PostgreSQL
SQLite is sufficient for 10,000 employees and removes the need for a separate DB server. Makes local setup simpler for reviewers.

### Pagination over Virtualization
Used pagination (50 rows/page) instead of virtual scrolling. More appropriate for an HR tool where managers filter and search rather than scroll.

### Frontend calculates insights locally
Instead of calling backend insights endpoints for every filter change, we fetch all employees once and calculate stats in the browser using useMemo. This reduces API calls and makes filtering instant.

### Batch inserts for seeding
Used SQLite transactions for seeding 10,000 employees — all inserts happen in one transaction instead of 10,000 individual writes. Reduces seed time significantly.

### Separate test database
Tests use SQLite in-memory database (NODE_ENV=test) so they never touch real data and run fast.

## TDD Approach
Followed strict TDD on the backend — every endpoint has a failing test committed before implementation. Frontend TDD was applied for key interactions (fetch on mount, add, edit, delete, confirmation dialog, loading state).

## AI Usage
- Claude (claude.ai) : used for step-by-step guidance, architectural decisions, TDD cycle guidance, debugging test failures
- Cursor : used for frontend component generation and refactoring
- All AI output was reviewed, understood, and modified where needed before committing