import { Check, X, TriangleAlert, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import PageHeader from "@/components/layout/PageHeader";
import Panel from "@/components/common/Panel";
import StatusBadge from "@/components/status/StatusBadge";
import TextInput from "@/components/forms/Input/TextInput";
import NumberInput from "@/components/forms/Input/NumberInput";
import Select from "@/components/forms/Select/Select";
import Button from "@/components/forms/Button/Button";
import ReadOnlyBanner from "@/components/common/ReadOnlyBanner";

import { TRIP_LIFECYCLE } from "@/services/mockData";
import { getTrips, createTrip, updateTrip, deleteTrip } from "./tripService";
import { getVehicles } from "../Vehicle/vehicleService";
import { getDrivers } from "../Driver/driverService";

import { useAuth } from "@/context/AuthContext";

const EMPTY_FORM = {
  source: "",
  destination: "",
  vehicle: "",
  driver: "",
  cargoWeight: "",
  plannedDistance: "",
};

export default function TripDispatcher() {
  const [trips, setTrips] = useState([]);

  const [vehicles, setVehicles] = useState([]);

  const [drivers, setDrivers] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);

  const [error, setError] = useState("");

  const [lastStatus, setLastStatus] = useState("Draft");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Track which trip (if any) is being edited
  const [editingId, setEditingId] = useState(null);

  const { hasAccess } = useAuth();

  const canEdit = hasAccess("trips") === "full";

  useEffect(() => {
    loadTrips();

    loadVehicles();

    loadDrivers();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await getTrips();

      setTrips(
        data.map((t) => ({
          id: t.trip_id,

          source: t.source,

          destination: t.destination,

          vehicle: t.vehicle_id,

          driver: t.driver_id,

          cargoWeight: t.cargo_weight,

          plannedDistance: t.planned_distance,

          status: t.status || "Dispatched",

          note: "",
        })),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await getVehicles();
      console.log("Vehicles loaded:", data);

      setVehicles(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadDrivers = async () => {
    try {
      const data = await getDrivers();

      console.log("Drivers loaded:", data);

      setDrivers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const selectedVehicle = vehicles.find(
    (v) => String(v.vehicle_id) === String(form.vehicle),
  );

  const capacityExceeded =
    selectedVehicle &&
    form.cargoWeight !== "" &&
    Number(form.cargoWeight) > Number(selectedVehicle.capacityKg);

  const canDispatch =
    canEdit &&
    form.source &&
    form.destination &&
    form.vehicle &&
    form.driver &&
    form.cargoWeight !== "" &&
    form.plannedDistance !== "" &&
    !capacityExceeded;

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setLastStatus("Draft");
  };

  const validateForm = () => {
    if (
      !form.source.trim() ||
      !form.destination.trim() ||
      !form.vehicle ||
      !form.driver ||
      form.cargoWeight === "" ||
      form.plannedDistance === ""
    ) {
      setError("All fields are required.");
      return false;
    }

    if (Number(form.cargoWeight) <= 0) {
      setError("Cargo weight must be greater than 0.");
      return false;
    }

    if (Number(form.plannedDistance) <= 0) {
      setError("Planned distance must be greater than 0.");
      return false;
    }

    if (capacityExceeded) {
      setError("Cargo weight exceeds vehicle capacity.");
      return false;
    }

    return true;
  };

  const handleDispatch = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        // Update existing trip
        await updateTrip(editingId, {
          source: form.source,
          destination: form.destination,
          vehicle_id: Number(form.vehicle),
          driver_id: Number(form.driver),
          cargo_weight: Number(form.cargoWeight),
          planned_distance: Number(form.plannedDistance),
        });
      } else {
        // Create new trip
        await createTrip({
          source: form.source,

          destination: form.destination,

          vehicle_id: Number(form.vehicle),

          driver_id: Number(form.driver),

          cargo_weight: Number(form.cargoWeight),

          planned_distance: Number(form.plannedDistance),

          user_id: 1,

          status: "Dispatched",
        });

        setLastStatus("Dispatched");
      }

      resetForm();

      loadTrips();
    } catch (err) {
      setError(err.response?.data?.message || "Trip save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (trip) => {
    setEditingId(trip.id);
    setForm({
      source: trip.source || "",
      destination: trip.destination || "",
      vehicle: trip.vehicle != null ? String(trip.vehicle) : "",
      driver: trip.driver != null ? String(trip.driver) : "",
      cargoWeight: trip.cargoWeight ?? "",
      plannedDistance: trip.plannedDistance ?? "",
    });
    setError("");
    setLastStatus(trip.status || "Draft");
  };

  const handleDeleteTrip = async (trip) => {
    if (!window.confirm(`Delete trip ${trip.source} → ${trip.destination}?`)) {
      return;
    }

    try {
      setDeletingId(trip.id);

      await deleteTrip(trip.id);

      if (editingId === trip.id) {
        resetForm();
      }

      loadTrips();
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingId(null);
    }
  };

  const completeTrip = async (id) => {
    await updateTrip(id, {
      status: "Completed",
    });

    loadTrips();
  };

  const cancelTrip = async (id) => {
    await updateTrip(id, {
      status: "Cancelled",
    });

    loadTrips();
  };

  const handleCancelForm = () => {
    resetForm();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip Dispatcher"
        subtitle="Draft → Dispatched → Completed → Cancelled."
      />

      {!canEdit && (
        <ReadOnlyBanner text="View-only access — only Dispatchers can create or update trips." />
      )}

      <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-4">
        {TRIP_LIFECYCLE.map((stage, i) => {
          const active = stage === lastStatus;

          return (
            <div key={stage} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    active
                      ? "bg-status-info"
                      : i === 0
                        ? "bg-status-success"
                        : "bg-line"
                  }`}
                />

                <span className="text-xs">{stage}</span>
              </div>

              {i < TRIP_LIFECYCLE.length - 1 && (
                <span className="h-px flex-1 bg-line" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          title={editingId ? "Edit Trip" : "Create Trip"}
          className="xl:col-span-1"
        >
          <div className="space-y-3">
            <TextInput
              label="Source"
              value={form.source}
              onChange={(v) => setForm((f) => ({ ...f, source: v }))}
            />

            <TextInput
              label="Destination"
              value={form.destination}
              onChange={(v) => setForm((f) => ({ ...f, destination: v }))}
            />

            <Select
              stacked
              label="Vehicle"
              options={vehicles.map((v) => ({
                value: v.vehicle_id,

                label: `${v.vehicle_no}`,
              }))}
              value={form.vehicle}
              onChange={(v) => setForm((f) => ({ ...f, vehicle: v }))}
            />

            <Select
              stacked
              label="Driver"
              options={drivers.map((d) => ({
                value: d.driver_id,

                label: d.driver_name,
              }))}
              value={form.driver}
              onChange={(v) => setForm((f) => ({ ...f, driver: v }))}
            />

            <NumberInput
              label="Cargo Weight"
              suffix="kg"
              value={form.cargoWeight}
              onChange={(v) => setForm((f) => ({ ...f, cargoWeight: v }))}
            />

            <NumberInput
              label="Planned Distance"
              suffix="km"
              value={form.plannedDistance}
              onChange={(v) => setForm((f) => ({ ...f, plannedDistance: v }))}
            />

            {capacityExceeded && (
              <div className="rounded-lg border border-status-danger/30 bg-status-danger-bg p-3 text-xs text-status-danger">
                <p>
                  Vehicle Capacity:
                  {selectedVehicle.capacityKg} kg
                </p>

                <p>
                  Cargo:
                  {form.cargoWeight} kg
                </p>

                <p className="flex gap-1 mt-1 font-semibold">
                  <TriangleAlert size={13} />
                  Capacity exceeded
                </p>
              </div>
            )}

            {error && <p className="text-xs text-status-danger">{error}</p>}

            <div className="flex gap-2">
              <Button
                // disabled={!canDispatch}
                onClick={handleDispatch}
                disabled={saving}
                className="flex-1 hover:cursor-pointer "
              >
                {saving ? "Saving..." : editingId ? "Update Trip" : "Dispatch"}
              </Button>

              <Button variant="secondary" onClick={handleCancelForm}>
                Cancel
              </Button>
            </div>
          </div>
        </Panel>

        <Panel
          title="Live Board"
          className="xl:col-span-2"
          bodyClassName="p-4 space-y-3"
        >
          {trips.map((trip) => (
            <div
              key={trip.id}
              className={`flex justify-between border rounded-lg p-3 ${
                editingId === trip.id ? "border-status-info bg-paper" : ""
              }`}
            >
              <div>
                <p className="font-mono text-xs">{trip.id}</p>

                <p>
                  {trip.source} → {trip.destination}
                </p>

                <p className="text-xs">
                  Vehicle {trip.vehicle} / Driver {trip.driver}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <StatusBadge status={trip.status} />

                {canEdit && trip.status === "Dispatched" && (
                  <div className="flex gap-1">
                    <div className="relative group">
                      <button
                        onClick={() => completeTrip(trip.id)}
                        className="bg-green-100 p-2 rounded hover:cursor-pointer hover:bg-green-200"
                      >
                        <Check size={14} />
                      </button>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-ink-900 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        Mark as Completed
                      </span>
                    </div>

                    <div className="relative group">
                      <button
                        onClick={() => cancelTrip(trip.id)}
                        className="bg-red-100 p-2 rounded hover:cursor-pointer hover:bg-red-200"
                      >
                        <X size={14} />
                      </button>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-ink-900 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        Cancel Trip
                      </span>
                    </div>
                  </div>
                )}

                {canEdit && (
                  <div className="flex gap-1">
                    <div className="relative group">
                      <button
                        onClick={() => handleEditClick(trip)}
                        className="bg-blue-100 p-2 rounded hover:cursor-pointer hover:bg-blue-200"
                      >
                        <Pencil size={14} />
                      </button>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-ink-900 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        Edit Trip
                      </span>
                    </div>

                    <div className="relative group">
                      <button
                        onClick={() => handleDeleteTrip(trip)}
                        disabled={deletingId === trip.id}
                        className="bg-red-100 p-2 rounded hover:cursor-pointer hover:bg-red-200 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-ink-900 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {deletingId === trip.id ? "Deleting..." : "Delete Trip"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}