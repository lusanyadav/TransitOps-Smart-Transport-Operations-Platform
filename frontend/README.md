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

# TransitOps — Frontend

Smart Transport Operations Platform (frontend only, backend to follow).

## Stack
- React 19 + Vite
- React Router
- Tailwind CSS v4
- lucide-react icons
- Recharts (Analytics chart)

## Run locally
```bash
npm install
npm run dev
```

## Structure
Follows the agreed folder layout under `src/`:
`components/`, `layouts/`, `pages/`, `hooks/`, `context/`, `services/`,
`routes/`, `utils/`, `constants/`.

## Pages (all built)
- [x] Auth — Login, Forgot Password
- [x] Dashboard — live KPIs, filters, recent trips, vehicle status
- [x] Fleet (Vehicle Registry) — CRUD table, unique reg. no. rule, Add Vehicle modal
- [x] Drivers & Safety Profiles — status toggles, expiry/suspension lockout
- [x] Trip Dispatcher — lifecycle stepper, capacity validation, live board with Complete/Cancel
- [x] Maintenance — log service record, auto vehicle status → In Shop / Available
- [x] Fuel & Expense Management — fuel logs, tolls/misc, auto operational cost
- [x] Reports & Analytics — KPIs, monthly revenue chart, top costliest vehicles, CSV export
- [x] Settings & RBAC — depot settings, role-permission matrix

## State & business rules
All fleet data (vehicles, drivers, trips, maintenance, fuel, expenses) lives in
`src/context/FleetContext.jsx` — a single shared store so actions on one page
(e.g. dispatching a trip) are reflected everywhere else (Fleet, Drivers,
Dashboard). It enforces the mandatory rules from the spec:
- Vehicle registration number and driver license number must be unique.
- Retired / In Shop vehicles never appear in the Trip Dispatcher.
- Expired-license or Suspended drivers can't be assigned to trips.
- Cargo weight can't exceed the vehicle's max capacity (dispatch blocked otherwise).
- Dispatch → vehicle & driver become On Trip; Complete/Cancel → back to Available.
- Creating maintenance → vehicle becomes In Shop; closing it → Available (unless retired).
- Operational Cost = Fuel + Maintenance, computed automatically.

`src/services/mockData.js` holds the seed/initial data — swap the context's
`useState` initializers for real API calls once the backend exists.

## Known simplifications (frontend-only stage)
- Login doesn't gate routes yet — `/` opens the Dashboard directly; `/login`
  is fully built and functional but not yet enforced. Real auth + RBAC
  enforcement will wire in with the backend.
- Fuel Efficiency and Monthly Revenue use illustrative figures — real values
  need trip odometer deltas and a revenue source the backend will provide.

