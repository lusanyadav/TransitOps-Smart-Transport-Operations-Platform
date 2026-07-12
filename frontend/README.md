# TransitOps — Frontend

Smart Transport Operations Platform (frontend only, backend to follow).

## Stack
- React 19 + Vite
- React Router
- Tailwind CSS v4
- lucide-react icons

## Run locally
```bash
npm install
npm run dev
```

## Structure
Follows the agreed folder layout under `src/`:
`components/`, `layouts/`, `pages/`, `hooks/`, `context/`, `services/`,
`routes/`, `utils/`, `constants/`.

## Progress (page-by-page)
- [x] App shell — Sidebar, Navbar, MainLayout
- [x] Dashboard
- [ ] Vehicle Registry (Fleet)
- [ ] Drivers & Safety Profiles
- [ ] Trip Dispatcher
- [ ] Maintenance
- [ ] Fuel & Expense Management
- [ ] Reports & Analytics
- [ ] Settings & RBAC
- [ ] Auth (Login)

Data is mocked in `src/services/mockData.js` — swap for real API calls
once the backend is ready.
