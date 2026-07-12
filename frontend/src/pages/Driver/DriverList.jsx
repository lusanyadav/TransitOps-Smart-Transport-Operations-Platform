import { useEffect, useState } from "react";
import { Plus, TriangleAlert } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Panel from "@/components/common/Panel";
import StatusBadge from "@/components/status/StatusBadge";
import TextInput from "@/components/forms/Input/TextInput";
import Select from "@/components/forms/Select/Select";
import Button from "@/components/forms/Button/Button";
import Modal from "@/components/modal/Modal";

import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "./driverService";

const EMPTY_FORM = {
  name: "",
  license: "",
  category: "LMV",
  expiry: "",
  contact: "",
};

export default function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);

      const data = await getDrivers(1, 100);

      setDrivers(data.records || data.data || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = drivers.filter((d) =>
    d.driver_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = async () => {
    if (!form.name || !form.license || !form.expiry) {
      setError("Name, License No. and Expiry are required.");

      return;
    }

    try {
      await createDriver({
        driver_name: form.name,
        licence_no: form.license,
        category: form.category,
        expiry: form.expiry,
        contact: form.contact,
        trip_comp: 0,
        safety: "Excellent",
        status: "Active",
        user_id: 1,
      });

      await loadDrivers();

      setForm(EMPTY_FORM);

      setError("");

      setModalOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create driver",
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) {
      return;
    }

    try {
      await deleteDriver(id);

      loadDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await updateDriver(id, {
        status,
      });

      loadDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  // let expired = false;
  let DRIVER_STATUS_TOGGLES  = ["Active", "Suspended", "Blocked"];
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

      <TextInput
        placeholder="Search drivers..."
        value={search}
        onChange={setSearch}
        className="w-64"
      />

      <Panel bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
              <th className="px-4 py-3">Driver</th>

              <th className="px-4 py-3">License No.</th>

              <th className="px-4 py-3">Category</th>

              <th className="px-4 py-3">Expiry</th>

              <th className="px-4 py-3">Contact</th>

              <th className="px-4 py-3">Trip Compl.</th>

              <th className="px-4 py-3">Safety</th>

              <th className="px-4 py-3">Status</th>

              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-5">
                  Loading...
                </td>
              </tr>
            ) : (
              filtered.map((d) => {
              const expired = d.expiry && new Date(d.expiry) < new Date();

                const blocked = expired || d.status === "Suspended";

                return (
                  <tr
                    key={d.driver_id}
                    className="border-b border-line-soft hover:bg-paper/60"
                  >
                    <td className="px-4 py-3 font-medium">{d.driver_name}</td>

                    <td className="px-4 py-3 font-mono text-xs">
                      {d.licence_no}
                    </td>

                    <td className="px-4 py-3">{d.category}</td>

                    <td className="px-4 py-3">
                      <span
                        className={
                          expired
                            ? "text-status-danger flex items-center gap-1"
                            : ""
                        }
                      >
                        {expired && <TriangleAlert size={12} />}

                        {new Date(d.expiry).toLocaleDateString("en-GB")}

                        {expired && " EXPIRED"}
                      </span>
                    </td>

                    <td className="px-4 py-3">{d.contact}</td>

                    <td className="px-4 py-3">{d.trip_comp}</td>

                    <td className="px-4 py-3">
                      <StatusBadge status={d.safety} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {DRIVER_STATUS_TOGGLES.map((s) => (
                          <button
                            key={s}
                            disabled={blocked && s !== "Suspended"}
                            onClick={() => changeStatus(d.driver_id, s)}
                            className={
                              d.status === s
                                ? "bg-ink-900 text-white rounded-full px-2 py-1 text-xs"
                                : "bg-paper rounded-full px-2 py-1 text-xs"
                            }
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(d.driver_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Panel>

      <p className="text-xs text-text-400">
        Rule: Expired license or Suspended status → blocked from trip
        assignment.
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
          <TextInput
            label="Name"
            value={form.name}
            onChange={(v) =>
              setForm({
                ...form,
                name: v,
              })
            }
          />

          <TextInput
            label="License No."
            value={form.license}
            onChange={(v) =>
              setForm({
                ...form,
                license: v,
              })
            }
          />

          <Select
            stacked
            label="Category"
            options={["LMV", "HMV"]}
            value={form.category}
            onChange={(v) =>
              setForm({
                ...form,
                category: v,
              })
            }
          />

          <TextInput
            label="License Expiry"
            type="date"
            value={form.expiry}
            onChange={(v) =>
              setForm({
                ...form,
                expiry: v,
              })
            }
          />

          <TextInput
            label="Contact Number"
            value={form.contact}
            onChange={(v) =>
              setForm({
                ...form,
                contact: v,
              })
            }
          />

          {error && <p className="text-xs text-status-danger">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}
