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

export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Fleet', path: ROUTES.FLEET, icon: Truck },
  { label: 'Drivers', path: ROUTES.DRIVERS, icon: Users },
  { label: 'Trips', path: ROUTES.TRIPS, icon: Route },
  { label: 'Maintenance', path: ROUTES.MAINTENANCE, icon: Wrench },
  { label: 'Fuel & Expenses', path: ROUTES.FUEL_EXPENSES, icon: Fuel },
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];
