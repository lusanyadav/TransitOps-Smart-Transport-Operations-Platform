import { useEffect, useState } from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Panel from '@/components/common/Panel';
import StatusBadge from '@/components/status/StatusBadge';
import TextInput from '@/components/forms/Input/TextInput';
import NumberInput from '@/components/forms/Input/NumberInput';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/forms/Button/Button';
import { formatCurrency } from '@/utils/format';

import {
  getMaintenanceLogs,
  createMaintenance,
  getVehicles,
  updateMaintenance,
  deleteMaintenance,
} from './maintenanceService';

const EMPTY_FORM = { vehicle: '', service: '', cost: '', date: '' };

export default function MaintenanceList() {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Track which record (if any) is being edited
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      const [vehicleData, maintenanceData] = await Promise.all([
        getVehicles(1, 100),
        getMaintenanceLogs(1, 100),
      ]);

      setVehicles(vehicleData.records || vehicleData.data || vehicleData || []);
      setMaintenanceLogs(
        maintenanceData.records || maintenanceData.data || maintenanceData || []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const vehicleById = (id) => vehicles.find((v) => v.vehicle_id === id);

  const eligibleVehicles = vehicles.filter((v) => v.status !== 'Retired');

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError('');
  };

  const handleSave = async () => {
    if (!form.vehicle || !form.service || form.cost === '' || !form.date) {
      setError('All fields are required.');
      return;
    }

    const vehicle = vehicleById(Number(form.vehicle));

    if (!vehicle) {
      setError('Selected vehicle could not be found.');
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        // Update existing record
        await updateMaintenance(editingId, {
          vehicle_id: vehicle.vehicle_id,
          service_type: form.service,
          cost: form.cost,
          service_date: form.date,
        });
      } else {
        // Create new record
        await createMaintenance({
          vehicle_id: vehicle.vehicle_id,
          service_type: form.service,
          cost: form.cost,
          service_date: form.date,
          status: 'In Shop',
          user_id: 1,
        });
      }

      await loadAll();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to save maintenance record'
      );
    } finally {
      setSaving(false);
    }
  };

  const closeMaintenance = async (log) => {
    try {
      await updateMaintenance(log.maintenance_id, { status: 'Completed' });

      await loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (log) => {
    const confirmed = window.confirm(
      `Delete maintenance record for ${vehicleById(log.vehicle_id)?.vehicle_no || log.vehicle_id}?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(log.maintenance_id);
      await deleteMaintenance(log.maintenance_id);

      // If the deleted record was being edited, reset the form
      if (editingId === log.maintenance_id) {
        resetForm();
      }

      await loadAll();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (log) => {
    setEditingId(log.maintenance_id);
    setForm({
      vehicle: String(log.vehicle_id),
      service: log.service_type || '',
      cost: log.cost ?? '',
      date: log.service_date ? log.service_date.slice(0, 10) : '',
    });
    setError('');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance" subtitle="Service records and vehicle shop status." />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          title={editingId ? 'Edit Service Record' : 'Log Service Record'}
          className="xl:col-span-1"
        >
          <div className="space-y-3">
            <Select
              stacked
              label="Vehicle"
              placeholder="Select vehicle"
              options={eligibleVehicles.map((v) => ({
                value: String(v.vehicle_id),
                label: v.vehicle_no,
              }))}
              value={form.vehicle}
              onChange={(v) => setForm((f) => ({ ...f, vehicle: v }))}
            />
            <TextInput
              label="Service Type"
              value={form.service}
              onChange={(v) => setForm((f) => ({ ...f, service: v }))}
              placeholder="Oil Change"
            />
            <NumberInput
              label="Cost"
              suffix="₹"
              value={form.cost}
              onChange={(v) => setForm((f) => ({ ...f, cost: v }))}
            />
            <TextInput
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => setForm((f) => ({ ...f, date: v }))}
            />
            {error && <p className="text-xs text-status-danger">{error}</p>}

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Save'}
              </Button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="whitespace-nowrap text-xs font-medium text-text-400 hover:text-text-600 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>

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
              <p className="mt-2 text-text-400">Tip: Click a vehicle number in the table to edit that record.</p>
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    Loading...
                  </td>
                </tr>
              ) : (
                maintenanceLogs.map((m) => {
                  const vehicle = vehicleById(m.vehicle_id);
                  const isEditingRow = editingId === m.maintenance_id;

                  return (
                    <tr
                      key={m.maintenance_id}
                      className={`border-b border-line-soft last:border-0 hover:bg-paper/60 ${
                        isEditingRow ? 'bg-paper' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-medium text-text-900">
                        <button
                          type="button"
                          onClick={() => handleEditClick(m)}
                          className="hover:underline hover:text-status-info"
                          title="Click to edit this record"
                        >
                          {vehicle ? vehicle.vehicle_no : m.vehicle_id}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-text-600">{m.service_type}</td>
                      <td className="px-4 py-3 font-mono text-text-600">{formatCurrency(m.cost)}</td>
                      <td className="px-4 py-3 text-text-400">
                        {m.service_date && new Date(m.service_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={m.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {m.status === 'In Shop' && (
                            <button
                              onClick={() => closeMaintenance(m)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-status-success hover:cursor-pointer hover:underline"
                            >
                              <CheckCircle2 size={13} strokeWidth={2.25} />
                              Close
                            </button>
                          )}
                          {m.status === 'Completed' && (
                            <button
                              className="inline-flex items-center gap-1 text-xs font-medium text-grey-500 hover:cursor-not-allowed"
                            >
                              <CheckCircle2 size={13} strokeWidth={2.25} />
                              Closed
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(m)}
                            disabled={deletingId === m.maintenance_id}
                            className="inline-flex items-center gap-1 text-xs font-medium text-status-danger hover:cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 size={13} strokeWidth={2.25} />
                            {deletingId === m.maintenance_id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}