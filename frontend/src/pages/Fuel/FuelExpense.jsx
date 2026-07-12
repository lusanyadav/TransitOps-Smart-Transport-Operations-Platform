import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Panel from '@/components/common/Panel';
import TextInput from '@/components/forms/Input/TextInput';
import NumberInput from '@/components/forms/Input/NumberInput';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/forms/Button/Button';
import Modal from '@/components/modal/Modal';
import { formatCurrency } from '@/utils/format';
import { useFleet } from '@/context/FleetContext';

const EMPTY_FUEL = { vehicle: '', date: '', liters: '', cost: '' };
const EMPTY_EXPENSE = { trip: '', vehicle: '', toll: '', other: '', maintLinked: '' };

export default function FuelExpense() {
  const { vehicles, fuelLogs, expenses, totalOperationalCost, logFuel, addExpense } = useFleet();
  const [fuelModal, setFuelModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [fuelForm, setFuelForm] = useState(EMPTY_FUEL);
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE);

  const saveFuel = () => {
    if (!fuelForm.vehicle || !fuelForm.date || !fuelForm.liters || !fuelForm.cost) return;
    logFuel(fuelForm);
    setFuelForm(EMPTY_FUEL);
    setFuelModal(false);
  };

  const saveExpense = () => {
    if (!expenseForm.trip || !expenseForm.vehicle) return;
    addExpense(expenseForm);
    setExpenseForm(EMPTY_EXPENSE);
    setExpenseModal(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel & Expense Management"
        subtitle="Fuel logs, tolls, and linked maintenance cost."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" icon={Plus} onClick={() => setExpenseModal(true)}>
              Add Expense
            </Button>
            <Button icon={Plus} onClick={() => setFuelModal(true)}>
              Log Fuel
            </Button>
          </div>
        }
      />

      <Panel title="Fuel Logs" bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Liters</th>
              <th className="px-4 py-3 font-medium">Fuel Cost</th>
            </tr>
          </thead>
          <tbody>
            {fuelLogs.map((f, i) => (
              <tr key={i} className="border-b border-line-soft last:border-0 hover:bg-paper/60">
                <td className="px-4 py-3 font-mono text-xs font-medium text-text-900">{f.vehicle}</td>
                <td className="px-4 py-3 text-text-400">{f.date}</td>
                <td className="px-4 py-3 font-mono text-text-600">{f.liters} L</td>
                <td className="px-4 py-3 font-mono text-text-600">{formatCurrency(f.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Other Expenses (Toll / Misc)" bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
              <th className="px-4 py-3 font-medium">Trip</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Toll</th>
              <th className="px-4 py-3 font-medium">Other</th>
              <th className="px-4 py-3 font-medium">Maint. (Linked)</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, i) => (
              <tr key={i} className="border-b border-line-soft last:border-0 hover:bg-paper/60">
                <td className="px-4 py-3 font-mono text-xs font-medium text-text-900">{e.trip}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-600">{e.vehicle}</td>
                <td className="px-4 py-3 font-mono text-text-600">{formatCurrency(e.toll)}</td>
                <td className="px-4 py-3 font-mono text-text-600">{formatCurrency(e.other)}</td>
                <td className="px-4 py-3 font-mono text-text-600">{formatCurrency(e.maintLinked)}</td>
                <td className="px-4 py-3 font-mono font-semibold text-text-900">
                  {formatCurrency(e.toll + e.other + e.maintLinked)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-4">
        <span className="text-sm text-text-600">Total Operational Cost (auto) = Fuel + Maintenance</span>
        <span className="font-mono text-lg font-semibold text-amber-600">
          {formatCurrency(totalOperationalCost)}
        </span>
      </div>

      <Modal
        open={fuelModal}
        onClose={() => setFuelModal(false)}
        title="Log Fuel"
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
            options={vehicles.map((v) => v.name)}
            value={fuelForm.vehicle}
            onChange={(v) => setFuelForm((f) => ({ ...f, vehicle: v }))}
          />
          <TextInput label="Date" type="date" value={fuelForm.date} onChange={(v) => setFuelForm((f) => ({ ...f, date: v }))} />
          <NumberInput label="Liters" suffix="L" value={fuelForm.liters} onChange={(v) => setFuelForm((f) => ({ ...f, liters: v }))} />
          <NumberInput label="Fuel Cost" suffix="₹" value={fuelForm.cost} onChange={(v) => setFuelForm((f) => ({ ...f, cost: v }))} />
        </div>
      </Modal>

      <Modal
        open={expenseModal}
        onClose={() => setExpenseModal(false)}
        title="Add Expense"
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
          <TextInput label="Trip ID" value={expenseForm.trip} onChange={(v) => setExpenseForm((f) => ({ ...f, trip: v }))} placeholder="TR001" />
          <Select
            stacked
            label="Vehicle"
            placeholder="Select vehicle"
            options={vehicles.map((v) => v.name)}
            value={expenseForm.vehicle}
            onChange={(v) => setExpenseForm((f) => ({ ...f, vehicle: v }))}
          />
          <NumberInput label="Toll" suffix="₹" value={expenseForm.toll} onChange={(v) => setExpenseForm((f) => ({ ...f, toll: v }))} />
          <NumberInput label="Other" suffix="₹" value={expenseForm.other} onChange={(v) => setExpenseForm((f) => ({ ...f, other: v }))} />
        </div>
      </Modal>
    </div>
  );
}
