import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FleetProvider } from '@/context/FleetContext';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ModuleGuard from '@/components/auth/ModuleGuard';
import MainLayout from '@/layouts/MainLayout';
import Login from '@/pages/Auth/Login';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import Dashboard from '@/pages/Dashboard/Dashboard';
import VehicleList from '@/pages/Vehicle/VehicleList';
import DriverList from '@/pages/Driver/DriverList';
import TripDispatcher from '@/pages/Trip/TripDispatcher';
import MaintenanceList from '@/pages/Maintenance/MaintenanceList';
import FuelExpense from '@/pages/Fuel/FuelExpense';
import Analytics from '@/pages/Reports/Analytics';
import Settings from '@/pages/Settings/Settings';
import { ROUTES } from '@/constants/routes';

export default function App() {
  return (
    <AuthProvider>
      <FleetProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <ModuleGuard module="dashboard">
                      <Dashboard />
                    </ModuleGuard>
                  }
                />
                <Route
                  path={ROUTES.FLEET}
                  element={
                    <ModuleGuard module="fleet">
                      <VehicleList />
                    </ModuleGuard>
                  }
                />
                <Route
                  path={ROUTES.DRIVERS}
                  element={
                    <ModuleGuard module="drivers">
                      <DriverList />
                    </ModuleGuard>
                  }
                />
                <Route
                  path={ROUTES.TRIPS}
                  element={
                    <ModuleGuard module="trips">
                      <TripDispatcher />
                    </ModuleGuard>
                  }
                />
                <Route
                  path={ROUTES.MAINTENANCE}
                  element={
                    <ModuleGuard module="maintenance">
                      <MaintenanceList />
                    </ModuleGuard>
                  }
                />
                <Route
                  path={ROUTES.FUEL_EXPENSES}
                  element={
                    <ModuleGuard module="fuelExpenses">
                      <FuelExpense />
                    </ModuleGuard>
                  }
                />
                <Route
                  path={ROUTES.ANALYTICS}
                  element={
                    <ModuleGuard module="analytics">
                      <Analytics />
                    </ModuleGuard>
                  }
                />
                <Route
                  path={ROUTES.SETTINGS}
                  element={
                    <ModuleGuard module="settings">
                      <Settings />
                    </ModuleGuard>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </FleetProvider>
    </AuthProvider>
  );
}
