import { useState } from 'react';
import { Plus, TriangleAlert } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Panel from '@/components/common/Panel';
import StatusBadge from '@/components/status/StatusBadge';
import TextInput from '@/components/forms/Input/TextInput';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/forms/Button/Button';
import Modal from '@/components/modal/Modal';
import { DRIVER_STATUS_TOGGLES, isLicenseExpired } from '@/services/mockData';
import { useFleet } from '@/context/FleetContext';

const EMPTY_FORM = { name: '', license: '', category: 'LMV', expiry: '', contact: '' };

export default function DriverList() {
  const { drivers, addDriver, setDriverStatus } = useFleet();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const filtered = drivers.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name || !form.license || !form.expiry) {
      setError('Name, License No. and Expiry are required.');
      return;
    }
    const result = addDriver(form);
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
        title="Drivers & Safety Profiles"
        subtitle="Compliance, license validity, and duty status."
        action={
          <Button icon={Plus} onClick={() => setModalOpen(true)}>
            Add Driver
          </Button>
        }
      />

      <TextInput placeholder="Search drivers..." value={search} onChange={setSearch} className="w-64" />

      <Panel bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">License No.</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Expiry</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Trip Compl.</th>
              <th className="px-4 py-3 font-medium">Safety</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => {
              const expired = isLicenseExpired(d.expiry);
              const blocked = expired || d.status === 'Suspended';
              return (
                <tr key={d.name} className="border-b border-line-soft last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-text-900">{d.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-600">{d.license}</td>
                  <td className="px-4 py-3 text-text-600">{d.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 font-mono text-xs ${expired ? 'text-status-danger' : 'text-text-600'}`}>
                      {expired && <TriangleAlert size={12} strokeWidth={2.5} />}
                      {new Date(d.expiry).toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' })}
                      {expired && ' EXPIRED'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-600">{d.contact}</td>
                  <td className="px-4 py-3 font-mono text-text-600">{d.tripCompletion}%</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.safety} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {DRIVER_STATUS_TOGGLES.map((s) => (
                        <button
                          key={s}
                          disabled={blocked && s !== 'Suspended'}
                          onClick={() => setDriverStatus(d.name, s)}
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            d.status === s
                              ? 'bg-ink-900 text-white'
                              : 'bg-paper text-text-600 hover:bg-line-soft'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <p className="text-xs text-text-400">
        Rule: Expired license or Suspended status → blocked from trip assignment.
      </p>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Driver"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Save Driver</Button>
          </>
        }
      >
        <div className="space-y-3">
          <TextInput label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <TextInput label="License No." value={form.license} onChange={(v) => setForm((f) => ({ ...f, license: v }))} placeholder="DL-00000" />
          <Select stacked label="Category" options={['LMV', 'HMV']} value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} />
          <TextInput label="License Expiry" type="date" value={form.expiry} onChange={(v) => setForm((f) => ({ ...f, expiry: v }))} />
          <TextInput label="Contact Number" value={form.contact} onChange={(v) => setForm((f) => ({ ...f, contact: v }))} placeholder="98xxxxxxxx" />
          {error && <p className="text-xs text-status-danger">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}
