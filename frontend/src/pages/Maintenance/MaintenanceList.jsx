import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Panel from '@/components/common/Panel';
import StatusBadge from '@/components/status/StatusBadge';
import TextInput from '@/components/forms/Input/TextInput';
import NumberInput from '@/components/forms/Input/NumberInput';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/forms/Button/Button';
import { formatCurrency } from '@/utils/format';
import { useFleet } from '@/context/FleetContext';

const EMPTY_FORM = { vehicle: '', service: '', cost: '', date: '' };

export default function MaintenanceList() {
  const { vehicles, maintenanceLogs, logMaintenance, closeMaintenance } = useFleet();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const eligibleVehicles = vehicles.filter((v) => v.status !== 'Retired');

  const handleSave = () => {
    if (!form.vehicle || !form.service || form.cost === '' || !form.date) {
      setError('All fields are required.');
      return;
    }
    const result = logMaintenance({ vehicleName: form.vehicle, service: form.service, cost: form.cost, date: form.date });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setForm(EMPTY_FORM);
    setError('');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance" subtitle="Service records and vehicle shop status." />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="Log Service Record" className="xl:col-span-1">
          <div className="space-y-3">
            <Select
              stacked
              label="Vehicle"
              placeholder="Select vehicle"
              options={eligibleVehicles.map((v) => ({ value: v.name, label: v.name }))}
              value={form.vehicle}
              onChange={(v) => setForm((f) => ({ ...f, vehicle: v }))}
            />
            <TextInput label="Service Type" value={form.service} onChange={(v) => setForm((f) => ({ ...f, service: v }))} placeholder="Oil Change" />
            <NumberInput label="Cost" suffix="₹" value={form.cost} onChange={(v) => setForm((f) => ({ ...f, cost: v }))} />
            <TextInput label="Date" type="date" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
            {error && <p className="text-xs text-status-danger">{error}</p>}
            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
            <div className="rounded-lg bg-paper p-3 text-xs text-text-600">
              <p>
                <span className="font-semibold text-status-success">Available</span> —logging active record→{' '}
                <span className="font-semibold text-status-warning">In Shop</span>
              </p>
              <p className="mt-1">
                <span className="font-semibold text-status-warning">In Shop</span> —closing record (not retired)→{' '}
                <span className="font-semibold text-status-success">Available</span>
              </p>
              <p className="mt-2 text-text-400">Note: In Shop vehicles are removed from the dispatch pool.</p>
            </div>
          </div>
        </Panel>

        <Panel title="Service Log" className="xl:col-span-2" bodyClassName="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Cost</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {maintenanceLogs.map((m) => (
                <tr key={m.id} className="border-b border-line-soft last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-text-900">{m.vehicle}</td>
                  <td className="px-4 py-3 text-text-600">{m.service}</td>
                  <td className="px-4 py-3 font-mono text-text-600">{formatCurrency(m.cost)}</td>
                  <td className="px-4 py-3 text-text-400">{m.date}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-4 py-3">
                    {m.status === 'In Shop' && (
                      <button
                        onClick={() => closeMaintenance(m.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-status-success hover:underline"
                      >
                        <CheckCircle2 size={13} strokeWidth={2.25} />
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
