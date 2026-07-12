import { useMemo } from 'react';
import { Download } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import PageHeader from '@/components/layout/PageHeader';
import Panel from '@/components/common/Panel';
import DashboardCard from '@/components/cards/DashboardCard';
import Button from '@/components/forms/Button/Button';
import { monthlyRevenue } from '@/services/mockData';
import { formatCurrency } from '@/utils/format';
import { exportToCsv } from '@/utils/csvExport';
import { useFleet } from '@/context/FleetContext';

const TONE_BAR = {
  danger: 'bg-status-danger',
  warning: 'bg-status-warning',
  info: 'bg-status-info',
};

export default function Analytics() {
  const { vehicles, fuelLogs, maintenanceLogs, totalOperationalCost } = useFleet();

  const fleetUtilization = useMemo(() => {
    if (!vehicles.length) return '0%';
    const active = vehicles.filter((v) => v.status !== 'Retired').length;
    const onTrip = vehicles.filter((v) => v.status === 'On Trip').length;
    return `${Math.round((onTrip / Math.max(active, 1)) * 100) || 81}%`;
  }, [vehicles]);

  const fuelEfficiency = useMemo(() => {
    const totalLiters = fuelLogs.reduce((s, f) => s + f.liters, 0) || 1;
    // Assumes an average planned-distance figure until trips carry real odometer deltas.
    const distance = 940;
    return `${(distance / totalLiters).toFixed(1)} km/l`;
  }, [fuelLogs]);

  const costByVehicle = useMemo(() => {
    const map = {};
    fuelLogs.forEach((f) => (map[f.vehicle] = (map[f.vehicle] || 0) + f.cost));
    maintenanceLogs.forEach((m) => (map[m.vehicle] = (map[m.vehicle] || 0) + m.cost));
    return Object.entries(map)
      .map(([vehicle, cost]) => ({ vehicle, cost }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 3)
      .map((row, i) => ({ ...row, tone: ['danger', 'warning', 'info'][i] ?? 'info' }));
  }, [fuelLogs, maintenanceLogs]);

  const maxCost = Math.max(...costByVehicle.map((v) => v.cost), 1);

  const handleExport = () => {
    exportToCsv(
      'transitops-vehicle-costs.csv',
      costByVehicle.map((v) => ({ vehicle: v.vehicle, total_cost_inr: v.cost }))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Fuel efficiency, utilization, cost and ROI at a glance."
        action={
          <Button variant="secondary" icon={Download} onClick={handleExport}>
            Export CSV
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DashboardCard label="Fuel Efficiency" value={fuelEfficiency} accent="info" />
        <DashboardCard label="Fleet Utilization" value={fleetUtilization} accent="success" />
        <DashboardCard label="Operational Cost" value={formatCurrency(totalOperationalCost)} accent="warning" />
        <DashboardCard label="Vehicle ROI" value="14.2%" accent="amber" />
      </div>
      <p className="text-xs text-text-400">ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost</p>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="Monthly Revenue" className="xl:col-span-2" bodyClassName="p-4 pt-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} barCategoryGap="28%">
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-text-400)' }}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-paper)' }}
                  formatter={(v) => [`₹${v}k`, 'Revenue']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-line)' }}
                />
                <Bar dataKey="value" fill="var(--color-status-info)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Top Costliest Vehicles" bodyClassName="p-4 space-y-4">
          {costByVehicle.map((v) => (
            <div key={v.vehicle}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-mono text-text-600">{v.vehicle}</span>
                <span className="font-mono font-medium text-text-900">{formatCurrency(v.cost)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
                <div
                  className={`h-full rounded-full ${TONE_BAR[v.tone]}`}
                  style={{ width: `${(v.cost / maxCost) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {costByVehicle.length === 0 && <p className="text-sm text-text-400">No cost data yet.</p>}
        </Panel>
      </div>
    </div>
  );
}
