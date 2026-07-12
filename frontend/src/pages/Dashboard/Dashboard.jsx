import { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Wrench,
  Route,
  Clock,
  Users,
  Gauge,
} from 'lucide-react';
import DashboardCard from '@/components/cards/DashboardCard';
import StatusBadge from '@/components/status/StatusBadge';
import Select from '@/components/forms/Select/Select';
import {
  dashboardKpis,
  recentTrips,
  vehicleStatusBreakdown,
  filterOptions,
} from '@/services/mockData';

const KPI_ICONS = {
  activeVehicles: Truck,
  availableVehicles: CheckCircle2,
  vehiclesInMaintenance: Wrench,
  activeTrips: Route,
  pendingTrips: Clock,
  driversOnDuty: Users,
  fleetUtilization: Gauge,
};

export default function Dashboard() {
  const [vehicleType, setVehicleType] = useState('All');
  const [status, setStatus] = useState('All');
  const [region, setRegion] = useState('All');

  const totalVehicles = vehicleStatusBreakdown.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-900">Dashboard</h1>
          <p className="text-sm text-text-400">Live overview of fleet, trips and drivers.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-400">
          Filters
        </span>
        <Select label="Vehicle Type" options={filterOptions.vehicleType} value={vehicleType} onChange={setVehicleType} />
        <Select label="Status" options={filterOptions.status} value={status} onChange={setStatus} />
        <Select label="Region" options={filterOptions.region} value={region} onChange={setRegion} />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {dashboardKpis.map((kpi) => (
          <DashboardCard
            key={kpi.key}
            label={kpi.label}
            value={kpi.value}
            accent={kpi.accent}
            icon={KPI_ICONS[kpi.key]}
          />
        ))}
      </div>

      {/* Recent trips + vehicle status */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-900">Recent Trips</h2>
            <span className="text-xs text-text-400">{recentTrips.length} trips</span>
          </div>
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
                  <th className="py-2 pr-3 font-medium">Trip</th>
                  <th className="py-2 pr-3 font-medium">Vehicle</th>
                  <th className="py-2 pr-3 font-medium">Driver</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">ETA</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-line-soft last:border-0">
                    <td className="py-2.5 pr-3 font-mono text-xs font-medium text-text-900">
                      {trip.id}
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-text-600">{trip.vehicle}</td>
                    <td className="py-2.5 pr-3 text-text-600">{trip.driver}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="py-2.5 pr-3 text-text-400">{trip.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text-900">Vehicle Status</h2>
          <div className="space-y-3">
            {vehicleStatusBreakdown.map((v) => (
              <div key={v.status}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-text-600">{v.status}</span>
                  <span className="font-mono font-medium text-text-900">{v.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
                  <div
                    className={`h-full rounded-full ${
                      {
                        success: 'bg-status-success',
                        info: 'bg-status-info',
                        warning: 'bg-status-warning',
                        danger: 'bg-status-danger',
                      }[v.tone]
                    }`}
                    style={{ width: `${(v.count / totalVehicles) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
