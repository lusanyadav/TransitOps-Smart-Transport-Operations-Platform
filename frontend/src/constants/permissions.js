import { ROUTES } from './routes';

// Four roles supported by RBAC login (mirrors the mockup's "One login, four roles").
export const ROLES = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];

// Module keys used to gate routes/pages. 'full' = create/edit, 'view' = read-only, 'none' = hidden/blocked.
export const ROLE_PERMISSIONS = {
  'Fleet Manager': {
    dashboard: 'full',
    fleet: 'full',
    drivers: 'full',
    trips: 'none',
    maintenance: 'full',
    fuelExpenses: 'none',
    analytics: 'full',
    settings: 'full',
  },
  Dispatcher: {
    dashboard: 'full',
    fleet: 'view',
    drivers: 'none',
    trips: 'full',
    maintenance: 'none',
    fuelExpenses: 'none',
    analytics: 'none',
    settings: 'none',
  },
  'Safety Officer': {
    dashboard: 'full',
    fleet: 'none',
    drivers: 'full',
    trips: 'view',
    maintenance: 'none',
    fuelExpenses: 'none',
    analytics: 'none',
    settings: 'none',
  },
  'Financial Analyst': {
    dashboard: 'full',
    fleet: 'view',
    drivers: 'none',
    trips: 'none',
    maintenance: 'none',
    fuelExpenses: 'full',
    analytics: 'full',
    settings: 'none',
  },
};

// Where each role lands immediately after signing in.
export const ROLE_LANDING = {
  'Fleet Manager': ROUTES.FLEET,
  Dispatcher: ROUTES.DASHBOARD,
  'Safety Officer': ROUTES.DRIVERS,
  'Financial Analyst': ROUTES.FUEL_EXPENSES,
};

// Demo accounts — no backend yet, so credentials are validated against this fixture.
export const MOCK_USERS = [
  {
    email: 'fleet.manager@transitops.in',
    password: 'Fleet@123',
    role: 'Fleet Manager',
    name: 'Meera Shah',
    initials: 'MS',
  },
  {
    email: 'dispatcher@transitops.in',
    password: 'Dispatch@123',
    role: 'Dispatcher',
    name: 'Raven K.',
    initials: 'RK',
  },
  {
    email: 'safety.officer@transitops.in',
    password: 'Safety@123',
    role: 'Safety Officer',
    name: 'Arjun Nair',
    initials: 'AN',
  },
  {
    email: 'finance.analyst@transitops.in',
    password: 'Finance@123',
    role: 'Financial Analyst',
    name: 'Priyanka Rao',
    initials: 'PR',
  },
];

export const MAX_LOGIN_ATTEMPTS = 5;
