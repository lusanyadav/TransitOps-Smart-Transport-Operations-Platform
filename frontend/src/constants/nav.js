import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
} from 'lucide-react';
import { ROUTES } from './routes';

// `module` maps each nav entry to a permissions key in ROLE_PERMISSIONS so the
// Sidebar can hide items the current role has no access to ('none').
export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, module: 'dashboard' },
  { label: 'Fleet', path: ROUTES.FLEET, icon: Truck, module: 'fleet' },
  { label: 'Drivers', path: ROUTES.DRIVERS, icon: Users, module: 'drivers' },
  { label: 'Trips', path: ROUTES.TRIPS, icon: Route, module: 'trips' },
  { label: 'Maintenance', path: ROUTES.MAINTENANCE, icon: Wrench, module: 'maintenance' },
  { label: 'Fuel & Expenses', path: ROUTES.FUEL_EXPENSES, icon: Fuel, module: 'fuelExpenses' },
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3, module: 'analytics' },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings, module: 'settings' },
];
