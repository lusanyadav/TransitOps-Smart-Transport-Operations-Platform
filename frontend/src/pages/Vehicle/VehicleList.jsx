import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Panel from '@/components/common/Panel';
import StatusBadge from '@/components/status/StatusBadge';
import Select from '@/components/forms/Select/Select';
import TextInput from '@/components/forms/Input/TextInput';
import NumberInput from '@/components/forms/Input/NumberInput';
import Button from '@/components/forms/Button/Button';
import Modal from '@/components/modal/Modal';
import ReadOnlyBanner from '@/components/common/ReadOnlyBanner';
import { formatNumber } from '@/utils/format';
import { VEHICLE_TYPES, VEHICLE_STATUSES } from '@/services/mockData';
import { useFleet } from '@/context/FleetContext';
import { useAuth } from '@/context/AuthContext';

const EMPTY_FORM = { regNo: '', name: '', type: 'Van', capacityKg: '', odometer: '', acqCost: '' };

export default function VehicleList() {
  const { vehicles, addVehicle } = useFleet();
  const { hasAccess } = useAuth();
  const canEdit = hasAccess('fleet') === 'full';
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const filtered = vehicles.filter((v) => {
    if (typeFilter !== 'All' && v.type !== typeFilter) return false;
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    if (search && !v.regNo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAdd = () => {
    if (!form.regNo || !form.name || !form.capacityKg) {
      setError('Registration No., Name and Capacity are required.');
      return;
    }
    const result = addVehicle({
      regNo: form.regNo.toUpperCase(),
      name: form.name,
      type: form.type,
      capacityKg: Number(form.capacityKg),
      odometer: Number(form.odometer) || 0,
      acqCost: Number(form.acqCost) || 0,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Registry"
        subtitle="Master list of fleet assets."
        action={
          canEdit && (
            <Button icon={Plus} onClick={() => setModalOpen(true)}>
              Add Vehicle
            </Button>
          )
        }
      />

      {!canEdit && <ReadOnlyBanner text="View-only access — Fleet edits are restricted to Fleet Managers." />}

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-3">
        <Select label="Type" options={['All', ...VEHICLE_TYPES]} value={typeFilter} onChange={setTypeFilter} />
        <Select label="Status" options={['All', ...VEHICLE_STATUSES]} value={statusFilter} onChange={setStatusFilter} />
        <TextInput placeholder="Search reg. no..." value={search} onChange={setSearch} className="w-48" />
      </div>

      <Panel bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
              <th className="px-4 py-3 font-medium">Reg. No. (Unique)</th>
              <th className="px-4 py-3 font-medium">Name/Model</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Capacity</th>
              <th className="px-4 py-3 font-medium">Odometer</th>
              <th className="px-4 py-3 font-medium">Acq. Cost</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.regNo} className="border-b border-line-soft last:border-0 hover:bg-paper/60">
                <td className="px-4 py-3 font-mono text-xs font-medium text-text-900">{v.regNo}</td>
                <td className="px-4 py-3 font-medium text-text-900">{v.name}</td>
                <td className="px-4 py-3 text-text-600">{v.type}</td>
                <td className="px-4 py-3 font-mono text-text-600">{formatNumber(v.capacityKg)} kg</td>
                <td className="px-4 py-3 font-mono text-text-600">{formatNumber(v.odometer)}</td>
                <td className="px-4 py-3 font-mono text-text-600">₹{formatNumber(v.acqCost)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-text-400">
                  No vehicles match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      <p className="text-xs text-text-400">
        Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher.
      </p>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Vehicle"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Save Vehicle</Button>
          </>
        }
      >
        <div className="space-y-3">
          <TextInput label="Registration No." value={form.regNo} onChange={(v) => setForm((f) => ({ ...f, regNo: v }))} placeholder="GJ01AB1234" />
          <TextInput label="Name / Model" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="VAN-10" />
          <Select stacked label="Type" options={VEHICLE_TYPES} value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} />
          <NumberInput label="Max Load Capacity" suffix="kg" value={form.capacityKg} onChange={(v) => setForm((f) => ({ ...f, capacityKg: v }))} />
          <NumberInput label="Odometer" suffix="km" value={form.odometer} onChange={(v) => setForm((f) => ({ ...f, odometer: v }))} />
          <NumberInput label="Acquisition Cost" suffix="₹" value={form.acqCost} onChange={(v) => setForm((f) => ({ ...f, acqCost: v }))} />
          {error && <p className="text-xs text-status-danger">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}
