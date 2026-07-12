

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import Panel from "@/components/common/Panel";
import TextInput from "@/components/forms/Input/TextInput";
import NumberInput from "@/components/forms/Input/NumberInput";
import Select from "@/components/forms/Select/Select";
import Button from "@/components/forms/Button/Button";
import Modal from "@/components/modal/Modal";
import { formatCurrency } from "@/utils/format";
import { getFuel, createFuel, deleteFuel, updateFuel } from "./fuelService";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "./expenssService";
import { getVehicles } from "../Vehicle/vehicleService";
import { getTrips } from "../Trip/tripService";

const EMPTY_FUEL = {
  vehicle_id: "",
  fuel_date: "",
  liters: "",
  rate: "",
  cost: "",
  user_id: 1,
};

const EMPTY_EXPENSE = {
  trip_id: "",
  vehicle_id: "",
  maintenance_id: null,
  toll_amt: "",
  other_amt: "",
  status: "Pending",
  user_id: 1,
};

export default function FuelExpense() {
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingFuel, setEditingFuel] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const [fuelModal, setFuelModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);

  const [fuelForm, setFuelForm] = useState(EMPTY_FUEL);
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fuelData, expenseData, vehicleData, tripData] = await Promise.all([
        getFuel(),
        getExpenses(),
        getVehicles(),
        getTrips(),
      ]);

      setFuelLogs(fuelData || []);
      setExpenses(expenseData || []);
      setVehicles(vehicleData || []);
      setTrips(tripData || []);
    } catch (error) {
      console.error("Error loading fuel expense data", error);
    }
  };

  const saveFuel = async () => {
    if (
      !fuelForm.vehicle_id ||
      !fuelForm.fuel_date ||
      !fuelForm.liters ||
      !fuelForm.cost
    ) {
      return;
    }

    try {
      if (editingFuel) {
        await updateFuel(editingFuel.fuel_id, fuelForm);
      } else {
        await createFuel(fuelForm);
      }

      setFuelForm(EMPTY_FUEL);
      setEditingFuel(null);
      setFuelModal(false);

      loadData();
    } catch (error) {
      console.error("Fuel save failed", error);
    }
  };

  const saveExpense = async () => {
    if (!expenseForm.vehicle_id) {
      return;
    }

    try {
      if (editingExpense) {
        await updateExpense(editingExpense.expense_id, expenseForm);
      } else {
        await createExpense(expenseForm);
      }

      setExpenseForm(EMPTY_EXPENSE);
      setEditingExpense(null);
      setExpenseModal(false);

      loadData();
    } catch (error) {
      console.error("Expense save failed", error);
    }
  };

  const editFuel = (fuel) => {
    setEditingFuel(fuel);

    setFuelForm({
      vehicle_id: fuel.vehicle_id,
      fuel_date: fuel.fuel_date,
      liters: fuel.liters,
      cost: fuel.cost,
      rate: fuel.rate || "",
      user_id: fuel.user_id || 1,
    });

    setFuelModal(true);
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);

    setExpenseForm({
      trip_id: expense.trip_id || "",
      vehicle_id: expense.vehicle_id,
      maintenance_id: expense.maintenance_id || null,
      toll_amt: expense.toll_amt || "",
      other_amt: expense.other_amt || "",
      status: expense.status || "Pending",
      user_id: expense.user_id || 1,
    });

    setExpenseModal(true);
  };

  const getVehicleLabel = (id) => {
  const vehicle = vehicles.find(
    (v) => String(v.vehicle_id) === String(id)
  );

  return vehicle?.vehicle_no || id;
};

const getTripLabel = (id) => {
  const trip = trips.find(
    (t) => String(t.trip_id) === String(id)
  );

  return trip
    ? `${trip.source} → ${trip.destination}`
    : id;
};
  const totalOperationalCost =
    fuelLogs.reduce((sum, item) => sum + Number(item.cost || 0), 0) +
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.toll_amt || 0) + Number(item.other_amt || 0),
      0,
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel & Expense Management"
        subtitle="Fuel logs, tolls, and linked maintenance cost."
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => {
                setEditingExpense(null);
                setExpenseForm(EMPTY_EXPENSE);
                setExpenseModal(true);
              }}
            >
              Add Expense
            </Button>

            <Button
              icon={Plus}
              onClick={() => {
                setEditingFuel(null);
                setFuelForm(EMPTY_FUEL);
                setFuelModal(true);
              }}
            >
              Log Fuel
            </Button>
          </div>
        }
      />

      {/* Fuel Table */}

      <Panel title="Fuel Logs" bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="w-[25%] px-4 py-3 text-left">Vehicle</th>
              <th className="w-[20%] px-4 py-3 text-left">Date</th>
              <th className="w-[15%] px-4 py-3 text-left">Liters</th>
              <th className="w-[20%] px-4 py-3 text-left">Fuel Cost</th>
              <th className="w-[20%] px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {fuelLogs.map((f) => (
              <tr key={f.fuel_id} className="border-b">
                <td
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-left"
                  onClick={() => editFuel(f)}
                >
                  {getVehicleLabel(f.vehicle_id)}
                </td>

                <td className="px-4 py-3 text-left">{new Date(f.fuel_date).toLocaleDateString("en-GB").replaceAll("/", "-")}</td>

                <td className="px-4 py-3 text-left">{f.liters} L</td>

                <td className="px-4 py-3 text-left">
                  {formatCurrency(f.cost)}
                </td>

                <td className="px-4 py-3 text-center">
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await deleteFuel(f.fuel_id);
                      loadData();
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel
        title="Other Expenses (Toll / Misc)"
        bodyClassName="overflow-x-auto p-0"
      >
        <table className="w-full min-w-[620px] table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="w-[20%] px-4 py-3 text-left">Trip</th>
              <th className="w-[20%] px-4 py-3 text-left">Vehicle</th>
              <th className="w-[15%] px-4 py-3 text-left">Toll</th>
              <th className="w-[15%] px-4 py-3 text-left">Other</th>
              <th className="w-[15%] px-4 py-3 text-left">Total</th>
              <th className="w-[15%] px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((e) => (
              <tr key={e.expense_id} className="border-b">
                <td
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-left"
                  onClick={() => editExpense(e)}
                >
                  {getTripLabel(e.trip_id)}
                </td>

                <td className="px-4 py-3 text-left">{getVehicleLabel(e.vehicle_id)}</td>

                <td className="px-4 py-3 text-left">
                  {formatCurrency(e.toll_amt)}
                </td>

                <td className="px-4 py-3 text-left">
                  {formatCurrency(e.other_amt)}
                </td>

                <td className="px-4 py-3 font-semibold text-left">
                  {formatCurrency(
                    Number(e.toll_amt || 0) + Number(e.other_amt || 0),
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await deleteExpense(e.expense_id);
                      loadData();
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="flex justify-between rounded-xl border p-4">
        <span>Total Operational Cost</span>

        <span className="font-semibold">
          {formatCurrency(totalOperationalCost)}
        </span>
      </div>

      {/* Fuel Modal */}

      <Modal
        open={fuelModal}
        onClose={() => setFuelModal(false)}
        title={editingFuel ? "Edit Fuel" : "Log Fuel"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFuelModal(false)}>
              Cancel
            </Button>

            <Button onClick={saveFuel}>Save</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Select
            stacked
            label="Vehicle"
            placeholder="Select vehicle"
            options={vehicles.map((v) => ({
              label: v.vehicle_no,
              value: v.vehicle_id,
            }))}
            value={fuelForm.vehicle_id}
            onChange={(v) =>
              setFuelForm({
                ...fuelForm,
                vehicle_id: v,
              })
            }
          />

          <TextInput
            label="Date"
            type="date"
            value={fuelForm.fuel_date}
            onChange={(v) =>
              setFuelForm({
                ...fuelForm,
                fuel_date: v,
              })
            }
          />

          <NumberInput
            label="Liters"
            suffix="L"
            value={fuelForm.liters}
            onChange={(v) =>
              setFuelForm({
                ...fuelForm,
                liters: v,
              })
            }
          />

          <NumberInput
            label="Cost"
            suffix="₹"
            value={fuelForm.cost}
            onChange={(v) =>
              setFuelForm({
                ...fuelForm,
                cost: v,
              })
            }
          />
        </div>
      </Modal>

      {/* Expense Modal */}

      <Modal
        open={expenseModal}
        onClose={() => setExpenseModal(false)}
        title={editingExpense ? "Edit Expense" : "Add Expense"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setExpenseModal(false)}>
              Cancel
            </Button>

            <Button onClick={saveExpense}>Save</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Select
            stacked
            label="Trip ID"
            options={trips.map((v) => ({
              label: v.source + " to " + v.destination,
              value: v.trip_id,
            }))}
            value={expenseForm.trip_id}
            onChange={(v) =>
              setExpenseForm({
                ...expenseForm,
                trip_id: v,
              })
            }
          />

          <Select
            stacked
            label="Vehicle"
            options={vehicles.map((v) => ({
              label: v.vehicle_no,
              value: v.vehicle_id,
            }))}
            value={expenseForm.vehicle_id}
            onChange={(v) =>
              setExpenseForm({
                ...expenseForm,
                vehicle_id: v,
              })
            }
          />

          <NumberInput
            label="Toll"
            suffix="₹"
            value={expenseForm.toll_amt}
            onChange={(v) =>
              setExpenseForm({
                ...expenseForm,
                toll_amt: v,
              })
            }
          />

          <NumberInput
            label="Other"
            suffix="₹"
            value={expenseForm.other_amt}
            onChange={(v) =>
              setExpenseForm({
                ...expenseForm,
                other_amt: v,
              })
            }
          />
        </div>
      </Modal>
    </div>
  );
}