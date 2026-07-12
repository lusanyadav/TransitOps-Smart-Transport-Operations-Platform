import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Panel from "@/components/common/Panel";
import StatusBadge from "@/components/status/StatusBadge";
import Select from "@/components/forms/Select/Select";
import TextInput from "@/components/forms/Input/TextInput";
import NumberInput from "@/components/forms/Input/NumberInput";
import Button from "@/components/forms/Button/Button";
import Modal from "@/components/modal/Modal";
import ReadOnlyBanner from "@/components/common/ReadOnlyBanner";
import { formatNumber } from "@/utils/format";
import { useAuth } from "@/context/AuthContext";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "./vehicleService";

const VEHICLE_TYPES = ["Van", "Truck", "Mini"];
const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];

const EMPTY_FORM = {
  regNo: "",
  name: "",
  type: "Van",
  capacityKg: "",
  odometer: "",
  acqCost: "",
  status: "Active",
};

export default function VehicleList() {
  const { hasAccess } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const canEdit = hasAccess("fleet") === "full";
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = vehicles.filter((v) => {
    if (typeFilter !== "All" && v.type !== typeFilter) return false;
    if (statusFilter !== "All" && v.status !== statusFilter) return false;
    if (search && !v.vehicle_no.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await getVehicles();

      setVehicles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const validateForm = () => {
    if (!form.regNo.trim()) {
      return "Registration Number is required.";
    }

    if (!form.name.trim()) {
      return "Vehicle Model is required.";
    }

    if (!form.capacityKg || Number(form.capacityKg) <= 0) {
      return "Capacity must be greater than 0.";
    }

    if (Number(form.odometer) < 0) {
      return "Odometer cannot be negative.";
    }

    if (Number(form.acqCost) < 0) {
      return "Acquisition Cost cannot be negative.";
    }

    return "";
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleAddClick = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleModalClose = () => {
    resetForm();
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!canEdit) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmDelete) return;

    try {
      await deleteVehicle(id);

      // Reload vehicle list
      loadVehicles();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  const handleSubmit = async () => {
    const validation = validateForm();

    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);

    const payload = {
      vehicle_no: form.regNo.toUpperCase(),
      model: form.name,
      type: form.type,
      capacity: Number(form.capacityKg),
      odometer: Number(form.odometer) || 0,
      acq_cost: Number(form.acqCost) || 0,
      status: form.status || "Active",
      user_id: 1,
    };

    try {
      if (editingId) {
        await updateVehicle(editingId, payload);
      } else {
        await createVehicle(payload);
      }

      await loadVehicles();

      resetForm();
      setModalOpen(false);
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response.data.error);
      } else {
        setError(err.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    if (!canEdit) return;

    setEditingId(vehicle.vehicle_id);

    setForm({
      regNo: vehicle.vehicle_no,
      name: vehicle.model,
      type: vehicle.type,
      capacityKg: vehicle.capacity,
      odometer: vehicle.odometer,
      acqCost: vehicle.acq_cost,
      status: vehicle.status,
    });

    setError("");
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Registry"
        subtitle="Master list of fleet assets."
        action={
          canEdit && (
            <Button icon={Plus} onClick={handleAddClick}>
              Add Vehicle
            </Button>
          )
        }
      />

      {!canEdit && (
        <ReadOnlyBanner text="View-only access — Fleet edits are restricted to Fleet Managers." />
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-3">
        <Select
          label="Type"
          options={["All", ...VEHICLE_TYPES]}
          value={typeFilter}
          onChange={setTypeFilter}
        />
        <Select
          label="Status"
          options={["All", ...VEHICLE_STATUSES]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <TextInput
          placeholder="Search reg. no..."
          value={search}
          onChange={setSearch}
          className="w-48"
        />
      </div>

      <Panel bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
              <th className="px-4 py-3 font-medium">Reg. No.</th>
              <th className="px-4 py-3 font-medium">Name/Model</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Capacity</th>
              <th className="px-4 py-3 font-medium">Odometer</th>
              <th className="px-4 py-3 font-medium">Acq. Cost</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {canEdit && (
                <th className="px-4 py-3 font-medium text-center">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr
                key={v.vehicle_id}
                className="border-b border-line-soft last:border-0 hover:bg-paper/60"
              >
                <td
                  className={
                    canEdit
                      ? "px-4 py-3 font-mono text-xs font-medium text-blue-600 cursor-pointer hover:text-blue-800 hover:underline transition-colors"
                      : "px-4 py-3 font-mono text-xs font-medium text-text-900"
                  }
                  onClick={canEdit ? () => handleEdit(v) : undefined}
                >
                  {v.vehicle_no}
                </td>
                <td className="px-4 py-3 font-medium text-text-900">
                  {v.model}
                </td>
                <td className="px-4 py-3 text-text-600">{v.type}</td>
                <td className="px-4 py-3 font-mono text-text-600">
                  {formatNumber(v.capacity)} kg
                </td>
                <td className="px-4 py-3 font-mono text-text-600">
                  {formatNumber(v.odometer)}
                </td>
                <td className="px-4 py-3 font-mono text-text-600">
                  {formatNumber(v.acq_cost)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} />
                </td>
                {canEdit && (
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(v.vehicle_id)}
                    >
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={canEdit ? 8 : 7}
                  className="px-4 py-10 text-center text-sm text-text-400"
                >
                  No vehicles match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      <p className="text-xs text-text-400">
        Rule: Registration No. must be unique · Retired/In Shop vehicles are
        hidden from Trip Dispatcher.
      </p>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        title={editingId ? "Update Vehicle" : "Add Vehicle"}
        footer={
          <>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                  ? "Update Vehicle"
                  : "Save Vehicle"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <TextInput
            label="Registration No."
            value={form.regNo}
            onChange={(v) => {
              setError("");
              setForm((f) => ({
                ...f,
                regNo: v,
              }));
            }}
            placeholder="GJ01AB1234"
          />
          <TextInput
            label="Name / Model"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="VAN-10"
          />
          <Select
            stacked
            label="Type"
            options={VEHICLE_TYPES}
            value={form.type}
            onChange={(v) => setForm((f) => ({ ...f, type: v }))}
          />
          <NumberInput
            label="Max Load Capacity"
            suffix="kg"
            value={form.capacityKg}
            onChange={(v) => setForm((f) => ({ ...f, capacityKg: v }))}
          />
          <NumberInput
            label="Odometer"
            suffix="km"
            value={form.odometer}
            onChange={(v) => setForm((f) => ({ ...f, odometer: v }))}
          />
          <NumberInput
            label="Acquisition Cost"
            suffix="₹"
            value={form.acqCost}
            onChange={(v) => setForm((f) => ({ ...f, acqCost: v }))}
          />
          {error && <p className="text-xs text-status-danger">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}