# LMS Portal

A full-stack learning management portal for training institutes: student dashboards, course modules, exams, attendance, placement/skill views, and an admin panel for recruiters and trainers.

## Repository structure

| Folder | Stack | Role |
|--------|--------|------|
| `lms-backend` | Node.js, Express, MySQL (`mysql2`) | REST API, JWT auth, business logic |
| `lms-frontend` | Next.js (App Router), React, Tailwind CSS | Student and admin UI |

The API listens on **port 9400**. The Next.js app runs on **port 3000** by default.

## Features

### Students

- Login and profile
- **Dashboard** — stats and course progress charts
- **Courses** — enrolled courses, modules, lesson content (Markdown)
- **Exams** — MCQ exams and submission
- **Results**, **Attendance**
- **Skill** and **Placement** insights (derived from enrollments and role)
- **AI Tutor** (`/Ai`) — UI placeholder for future tutor integration

### Admins

- **Admin login** — `/Adminlogin` → `POST /adminlogin` (accounts in `adminlogin` table)
- **Admin panel** (`/Admin`) — register students, create courses, enroll students in existing courses, attendance, results, exams (questions/options), modules (add/update content)

### Data model (high level)

- **`course1`** — course catalog (shared content)
- **`enrollment`** — which student is on which course (+ progress `pct`)
- **`course_module`** — lessons belong to a **course**, not per student; all enrolled students see new modules
- **`student`** — learner accounts; **`adminlogin`** — admin accounts

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **MySQL** (or compatible host, e.g. TiDB Cloud) with database `lms` and schema/tables your app expects
- **npm** (or pnpm/yarn)

## Configuration

### Backend (`lms-backend`)

1. Install dependencies:

   ```bash
   cd lms-backend
   npm install
   ```

2. Create `lms-backend/.env`:

   ```env
   jwtsecret=your-long-random-secret-here
   ```

   Do **not** commit real secrets. Use a strong value in production.

3. Configure MySQL in `lms-backend/db/index.js` (host, port, user, password, database, SSL). Prefer environment variables or a local-only config file that is gitignored.

4. Start the API:

   ```bash
   npm run dev    # nodemon
   # or
   npm start
   ```

   You should see: `server is running on port 9400`.

### Frontend (`lms-frontend`)

1. Install dependencies:

   ```bash
   cd lms-frontend
   npm install
   ```

2. Optional — pin API URL (otherwise the client uses `http://<browser-hostname>:9400`):

   Create `lms-frontend/.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:9400
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

For LAN testing (phone/other PC), use your machine IP in the browser and set `NEXT_PUBLIC_API_URL` if needed. `next.config.mjs` may list `allowedDevOrigins` for your dev host.

## Common URLs

| Page | Path |
|------|------|
| Student login | `/` |
| Admin login | `/Adminlogin` |
| Admin panel | `/Admin` |
| Dashboard | `/Dashboard` |
| Courses | `/Courses` |
| AI Tutor | `/Ai` |

## Typical admin workflows

1. **New candidate** — Admin → **Students** → register → share login details.
2. **Add candidate to existing course** — **Assign Existing Course to Another Student** → pick student + course → **Enroll Student** (`POST /enrollment`). Do not use **Create & Assign Course** unless you are creating a **new** course row.
3. **Add module 9 (or any lesson) to an existing course** — **Modules — Add New** → select the **course** → title + Markdown content → **Add Module**. No per-student step if the student is already enrolled.

## API overview

Auth uses **JWT** in the `Authorization: Bearer <token>` header (stored in `localStorage` as `token` on the client).

| Area | Examples |
|------|-----------|
| Student auth | `POST /register`, `POST /login` |
| Admin auth | `POST /adminregister`, `POST /adminlogin` |
| Courses | `GET /courses`, `POST /courses`, `POST /enrollment` |
| Modules | `GET /modules`, `POST /modules`, `PUT /modules/:id` |
| Exams | `POST /submit`, questions/options admin routes under `/admin/*` |

Health check: `GET /hello`.

## Scripts

**Backend**

- `npm start` — run `server.js`
- `npm run dev` — run with nodemon

**Frontend**

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Login works in Postman but not in the browser | Same API base URL (`NEXT_PUBLIC_API_URL` vs `localhost:9400`); admin uses `/adminlogin`, students use `/login` |
| `invalid email or password` after admin register | Admin register writes to `adminlogin`; `/adminlogin` must query the same table |
| Cannot delete exam option | `submit` rows reference `options.id` — delete child rows first or edit the option text instead |
| Modules not visible to student | Student must be in `enrollment` for that `course_id` |
| CORS / network errors | Backend running on `0.0.0.0:9400`; firewall; correct API URL |

## Security notes

- Rotate JWT secrets and database credentials for production.
- Keep `lms-backend/.env` and database passwords out of version control.
- Admin and student tokens share the same `localStorage` key today; use separate keys or sessions if you harden auth later.

## License

Private / internal — set license as appropriate for your organization.
