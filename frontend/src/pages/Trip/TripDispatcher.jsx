import { useState } from 'react';
import { Check, X, TriangleAlert } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Panel from '@/components/common/Panel';
import StatusBadge from '@/components/status/StatusBadge';
import TextInput from '@/components/forms/Input/TextInput';
import NumberInput from '@/components/forms/Input/NumberInput';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/forms/Button/Button';
import ReadOnlyBanner from '@/components/common/ReadOnlyBanner';
import { TRIP_LIFECYCLE } from '@/services/mockData';
import { useFleet } from '@/context/FleetContext';
import { useAuth } from '@/context/AuthContext';

const EMPTY_FORM = { source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' };

export default function TripDispatcher() {
  const { trips, dispatchableVehicles, dispatchableDrivers, completeTrip, cancelTrip, dispatchTrip } = useFleet();
  const { hasAccess } = useAuth();
  const canEdit = hasAccess('trips') === 'full';
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [lastStatus, setLastStatus] = useState('Draft');

  const selectedVehicle = dispatchableVehicles.find((v) => v.name === form.vehicle);
  const capacityExceeded =
    selectedVehicle && form.cargoWeight !== '' && Number(form.cargoWeight) > selectedVehicle.capacityKg;

  const canDispatch =
    canEdit &&
    form.source && form.destination && form.vehicle && form.driver && form.cargoWeight !== '' && form.plannedDistance !== '' && !capacityExceeded;

  const handleDispatch = () => {
    const result = dispatchTrip({
      source: form.source,
      destination: form.destination,
      vehicleName: form.vehicle,
      driverName: form.driver,
      cargoWeight: form.cargoWeight,
      plannedDistance: form.plannedDistance,
    });
    if (!result.ok) {
      setError(result.error);
      setLastStatus('Draft');
      return;
    }
    setError('');
    setLastStatus('Dispatched');
    setForm(EMPTY_FORM);
  };

  const handleCancelForm = () => {
    setForm(EMPTY_FORM);
    setError('');
    setLastStatus('Draft');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Trip Dispatcher" subtitle="Draft → Dispatched → Completed → Cancelled." />

      {!canEdit && <ReadOnlyBanner text="View-only access — only Dispatchers can create or update trips." />}

      {/* Lifecycle stepper */}
      <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-4">
        {TRIP_LIFECYCLE.map((stage, i) => {
          const active = stage === lastStatus;
          return (
            <div key={stage} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    active ? 'bg-status-info' : i === 0 ? 'bg-status-success' : 'bg-line'
                  }`}
                />
                <span className={`text-xs font-medium ${active ? 'text-status-info' : 'text-text-400'}`}>
                  {stage}
                </span>
              </div>
              {i < TRIP_LIFECYCLE.length - 1 && <span className="h-px flex-1 bg-line" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Create trip form */}
        <Panel title="Create Trip" className="xl:col-span-1">
          <div className="space-y-3">
            <TextInput label="Source" value={form.source} onChange={(v) => setForm((f) => ({ ...f, source: v }))} placeholder="Gandhinagar Depot" disabled={!canEdit} />
            <TextInput label="Destination" value={form.destination} onChange={(v) => setForm((f) => ({ ...f, destination: v }))} placeholder="Ahmedabad Hub" disabled={!canEdit} />
            <Select
              stacked
              label="Vehicle (available only)"
              placeholder="Select vehicle"
              options={dispatchableVehicles.map((v) => ({ value: v.name, label: `${v.name} — ${v.capacityKg} kg capacity` }))}
              value={form.vehicle}
              onChange={(v) => setForm((f) => ({ ...f, vehicle: v }))}
              disabled={!canEdit}
            />
            <Select
              stacked
              label="Driver (available only)"
              placeholder="Select driver"
              options={dispatchableDrivers.map((d) => ({ value: d.name, label: d.name }))}
              value={form.driver}
              onChange={(v) => setForm((f) => ({ ...f, driver: v }))}
              disabled={!canEdit}
            />
            <NumberInput label="Cargo Weight" suffix="kg" value={form.cargoWeight} onChange={(v) => setForm((f) => ({ ...f, cargoWeight: v }))} disabled={!canEdit} />
            <NumberInput label="Planned Distance" suffix="km" value={form.plannedDistance} onChange={(v) => setForm((f) => ({ ...f, plannedDistance: v }))} disabled={!canEdit} />

            {capacityExceeded && (
              <div className="rounded-lg border border-status-danger/30 bg-status-danger-bg p-3 text-xs text-status-danger">
                <p>Vehicle Capacity: {selectedVehicle.capacityKg} kg</p>
                <p>Cargo Weight: {form.cargoWeight} kg</p>
                <p className="mt-1 flex items-center gap-1 font-semibold">
                  <TriangleAlert size={13} strokeWidth={2.5} />
                  Capacity exceeded by {Number(form.cargoWeight) - selectedVehicle.capacityKg} kg — dispatch blocked
                </p>
              </div>
            )}
            {error && <p className="text-xs text-status-danger">{error}</p>}

            <div className="flex gap-2 pt-1">
              <Button disabled={!canDispatch} onClick={handleDispatch} className="flex-1">
                {canDispatch ? 'Dispatch' : 'Dispatch (disabled)'}
              </Button>
              <Button variant="secondary" onClick={handleCancelForm} disabled={!canEdit}>
                Cancel
              </Button>
            </div>
          </div>
        </Panel>

        {/* Live board */}
        <Panel title="Live Board" className="xl:col-span-2" bodyClassName="p-4 space-y-3">
          {trips.map((trip) => (
            <div key={trip.id} className="flex items-center justify-between rounded-lg border border-line-soft p-3">
              <div>
                <p className="font-mono text-xs font-semibold text-text-900">{trip.id}</p>
                <p className="mt-0.5 text-sm text-text-600">
                  {trip.source} → {trip.destination}
                </p>
                <p className="mt-0.5 font-mono text-xs text-text-400">
                  {trip.vehicle} / {trip.driver}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <StatusBadge status={trip.status} />
                  <p className="mt-1 text-xs text-text-400">{trip.note}</p>
                </div>
                {canEdit && trip.status === 'Dispatched' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => completeTrip(trip.id)}
                      className="rounded-md bg-status-success-bg p-1.5 text-status-success hover:brightness-95"
                      title="Complete trip"
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => cancelTrip(trip.id)}
                      className="rounded-md bg-status-danger-bg p-1.5 text-status-danger hover:brightness-95"
                      title="Cancel trip"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <p className="pt-1 text-xs text-text-400">
            On Complete: odometer → fuel log → expenses → Vehicle &amp; Driver become Available.
          </p>
        </Panel>
      </div>
    </div>
  );
}
