import { useState } from 'react';
import { Check, Eye, Minus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Panel from '@/components/common/Panel';
import TextInput from '@/components/forms/Input/TextInput';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/forms/Button/Button';
import { depotSettings, rbacMatrix } from '@/services/mockData';

const PERMISSION_ICON = {
  full: <Check size={14} strokeWidth={2.5} className="text-status-success" />,
  view: <Eye size={14} strokeWidth={2} className="text-status-info" />,
  none: <Minus size={14} strokeWidth={2.5} className="text-text-400" />,
};

const COLUMNS = [
  { key: 'fleet', label: 'Fleet' },
  { key: 'drivers', label: 'Drivers' },
  { key: 'trips', label: 'Trips' },
  { key: 'fuelExp', label: 'Fuel/Exp.' },
  { key: 'analytics', label: 'Analytics' },
];

export default function Settings() {
  const [form, setForm] = useState(depotSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings & RBAC" subtitle="Depot configuration and role-based access control." />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="General" className="xl:col-span-1">
          <div className="space-y-3">
            <TextInput label="Depot Name" value={form.depotName} onChange={(v) => setForm((f) => ({ ...f, depotName: v }))} />
            <Select stacked label="Currency" options={['INR (₹)', 'USD ($)']} value={form.currency} onChange={(v) => setForm((f) => ({ ...f, currency: v }))} />
            <Select stacked label="Distance Unit" options={['Kilometers', 'Miles']} value={form.distanceUnit} onChange={(v) => setForm((f) => ({ ...f, distanceUnit: v }))} />
            <Button onClick={handleSave} className="w-full">
              {saved ? 'Saved ✓' : 'Save changes'}
            </Button>
          </div>
        </Panel>

        <Panel title="Role-Based Access (RBAC)" className="xl:col-span-2" bodyClassName="overflow-x-auto p-0">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
                <th className="px-4 py-3 font-medium">Role</th>
                {COLUMNS.map((c) => (
                  <th key={c.key} className="px-4 py-3 text-center font-medium">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rbacMatrix.map((row) => (
                <tr key={row.role} className="border-b border-line-soft last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-text-900">{row.role}</td>
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-center">
                      <span className="inline-flex">{PERMISSION_ICON[row[c.key]]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
