import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard/Dashboard';
import ComingSoon from '@/components/common/ComingSoon';
import { ROUTES } from '@/constants/routes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.FLEET} element={<ComingSoon title="Vehicle Registry" />} />
          <Route path={ROUTES.DRIVERS} element={<ComingSoon title="Drivers & Safety Profiles" />} />
          <Route path={ROUTES.TRIPS} element={<ComingSoon title="Trip Dispatcher" />} />
          <Route path={ROUTES.MAINTENANCE} element={<ComingSoon title="Maintenance" />} />
          <Route path={ROUTES.FUEL_EXPENSES} element={<ComingSoon title="Fuel & Expense Management" />} />
          <Route path={ROUTES.ANALYTICS} element={<ComingSoon title="Reports & Analytics" />} />
          <Route path={ROUTES.SETTINGS} element={<ComingSoon title="Settings & RBAC" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
