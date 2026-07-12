import { createContext, useContext, useMemo, useState } from 'react';
import {
  initialVehicles,
  initialDrivers,
  initialTripBoard,
  initialServiceLogs,
  initialFuelLogs,
  initialOtherExpenses,
  isLicenseExpired,
} from '@/services/mockData';

const FleetContext = createContext(null);

let tripCounter = 7; // seed data already uses TR001-TR006
let maintCounter = 1;

export function FleetProvider({ children }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [trips, setTrips] = useState(initialTripBoard);
  const [maintenanceLogs, setMaintenanceLogs] = useState(initialServiceLogs);
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [expenses, setExpenses] = useState(initialOtherExpenses);

  // ---- Vehicles -----------------------------------------------------------
  const addVehicle = (vehicle) => {
    if (vehicles.some((v) => v.regNo.toLowerCase() === vehicle.regNo.toLowerCase())) {
      return { ok: false, error: 'Registration No. must be unique — this one is already registered.' };
    }
    setVehicles((prev) => [...prev, { ...vehicle, status: 'Available' }]);
    return { ok: true };
  };

  const setVehicleStatus = (regNoOrName, status) =>
    setVehicles((prev) =>
      prev.map((v) => (v.regNo === regNoOrName || v.name === regNoOrName ? { ...v, status } : v))
    );

  // Vehicles eligible to appear in the Trip Dispatcher's vehicle picker
  const dispatchableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === 'Available'),
    [vehicles]
  );

  // ---- Drivers --------------------------------------------------------------
  const addDriver = (driver) => {
    if (drivers.some((d) => d.license.toLowerCase() === driver.license.toLowerCase())) {
      return { ok: false, error: 'License No. must be unique — this one is already registered.' };
    }
    setDrivers((prev) => [...prev, { ...driver, tripCompletion: 0, safety: 'Available', status: 'Available' }]);
    return { ok: true };
  };

  const setDriverStatus = (name, status) => {
    const driver = drivers.find((d) => d.name === name);
    if (!driver) return;
    // Expired license or Suspended drivers stay locked out of duty toggles.
    if ((isLicenseExpired(driver.expiry) || driver.status === 'Suspended') && status !== 'Suspended') return;
    setDrivers((prev) => prev.map((d) => (d.name === name ? { ...d, status } : d)));
  };

  // Drivers eligible to appear in the Trip Dispatcher's driver picker
  const dispatchableDrivers = useMemo(
    () => drivers.filter((d) => d.status === 'Available' && !isLicenseExpired(d.expiry)),
    [drivers]
  );

  // ---- Trips ------------------------------------------------------------------
  // Validates + immediately dispatches a trip (mirrors the mockup's single-step flow).
  const dispatchTrip = ({ source, destination, vehicleName, driverName, cargoWeight, plannedDistance }) => {
    const vehicle = vehicles.find((v) => v.name === vehicleName);
    const driver = drivers.find((d) => d.name === driverName);

    if (!vehicle || vehicle.status !== 'Available') return { ok: false, error: 'Selected vehicle is no longer available.' };
    if (!driver || driver.status !== 'Available' || isLicenseExpired(driver.expiry))
      return { ok: false, error: 'Selected driver is no longer available.' };
    if (Number(cargoWeight) > vehicle.capacityKg)
      return {
        ok: false,
        error: `Capacity exceeded by ${Number(cargoWeight) - vehicle.capacityKg} kg — dispatch blocked.`,
      };

    const id = `TR${String(tripCounter++).padStart(3, '0')}`;
    setTrips((prev) => [
      { id, source, destination, vehicle: vehicle.name, driver: driver.name, cargoWeight: Number(cargoWeight), plannedDistance: Number(plannedDistance), status: 'Dispatched', note: 'Just dispatched' },
      ...prev,
    ]);
    setVehicleStatus(vehicle.name, 'On Trip');
    setDriverStatus(driver.name, 'On Trip');
    return { ok: true, id };
  };

  const completeTrip = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || trip.status !== 'Dispatched') return;
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status: 'Completed', note: '—' } : t)));
    setVehicleStatus(trip.vehicle, 'Available');
    setDrivers((prev) => prev.map((d) => (d.name === trip.driver ? { ...d, status: 'Available' } : d)));
  };

  const cancelTrip = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || trip.status !== 'Dispatched') return;
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status: 'Cancelled', note: 'Cancelled by dispatcher' } : t)));
    setVehicleStatus(trip.vehicle, 'Available');
    setDrivers((prev) => prev.map((d) => (d.name === trip.driver ? { ...d, status: 'Available' } : d)));
  };

  // ---- Maintenance -----------------------------------------------------------
  const logMaintenance = ({ vehicleName, service, cost, date }) => {
    const vehicle = vehicles.find((v) => v.name === vehicleName);
    if (!vehicle) return { ok: false, error: 'Select a valid vehicle.' };
    const id = `MT${String(maintCounter++).padStart(3, '0')}`;
    setMaintenanceLogs((prev) => [{ id, vehicle: vehicle.name, service, cost: Number(cost), date, status: 'In Shop' }, ...prev]);
    setVehicleStatus(vehicle.name, 'In Shop');
    return { ok: true };
  };

  const closeMaintenance = (id) => {
    const record = maintenanceLogs.find((m) => m.id === id);
    if (!record || record.status !== 'In Shop') return;
    setMaintenanceLogs((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'Completed' } : m)));
    const vehicle = vehicles.find((v) => v.name === record.vehicle);
    if (vehicle && vehicle.status !== 'Retired') setVehicleStatus(record.vehicle, 'Available');
  };

  // ---- Fuel & Expenses -----------------------------------------------------------
  const logFuel = (entry) => setFuelLogs((prev) => [{ ...entry, liters: Number(entry.liters), cost: Number(entry.cost) }, ...prev]);
  const addExpense = (entry) =>
    setExpenses((prev) => [
      { ...entry, toll: Number(entry.toll) || 0, other: Number(entry.other) || 0, maintLinked: Number(entry.maintLinked) || 0 },
      ...prev,
    ]);

  // ---- Derived operational cost (Fuel + Maintenance), per spec 3.7 -----------------
  const totalFuelCost = useMemo(() => fuelLogs.reduce((sum, f) => sum + f.cost, 0), [fuelLogs]);
  const totalMaintCost = useMemo(() => maintenanceLogs.reduce((sum, m) => sum + m.cost, 0), [maintenanceLogs]);
  const totalOperationalCost = totalFuelCost + totalMaintCost;

  const value = {
    vehicles,
    drivers,
    trips,
    maintenanceLogs,
    fuelLogs,
    expenses,
    dispatchableVehicles,
    dispatchableDrivers,
    totalFuelCost,
    totalMaintCost,
    totalOperationalCost,
    addVehicle,
    addDriver,
    setDriverStatus,
    dispatchTrip,
    completeTrip,
    cancelTrip,
    logMaintenance,
    closeMaintenance,
    logFuel,
    addExpense,
  };

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

export const useFleet = () => {
  const ctx = useContext(FleetContext);
  if (!ctx) throw new Error('useFleet must be used within a FleetProvider');
  return ctx;
};
