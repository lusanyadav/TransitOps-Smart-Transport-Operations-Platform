// Placeholder data layer. Once the backend exists, these named exports
// become async calls (e.g. GET /api/dashboard) — pages already consume
// them as if they were, so swapping later is a one-file change.

export const dashboardKpis = [
  { key: 'activeVehicles', label: 'Active Vehicles', value: '53', accent: 'info' },
  { key: 'availableVehicles', label: 'Available Vehicles', value: '42', accent: 'success' },
  { key: 'vehiclesInMaintenance', label: 'Vehicles in Maintenance', value: '05', accent: 'warning' },
  { key: 'activeTrips', label: 'Active Trips', value: '18', accent: 'info' },
  { key: 'pendingTrips', label: 'Pending Trips', value: '09', accent: 'warning' },
  { key: 'driversOnDuty', label: 'Drivers On Duty', value: '26', accent: 'success' },
  { key: 'fleetUtilization', label: 'Fleet Utilization', value: '81%', accent: 'amber' },
];

export const recentTrips = [
  { id: 'TR001', vehicle: 'VAN-05', driver: 'Alex', status: 'On Trip', eta: '45 min' },
  { id: 'TR002', vehicle: 'TRK-12', driver: 'John', status: 'Completed', eta: '—' },
  { id: 'TR003', vehicle: 'MINI-08', driver: 'Priya', status: 'Dispatched', eta: '1h 10m' },
  { id: 'TR004', vehicle: '—', driver: '—', status: 'Draft', eta: 'Awaiting vehicle' },
];

export const vehicleStatusBreakdown = [
  { status: 'Available', count: 42, tone: 'success' },
  { status: 'On Trip', count: 18, tone: 'info' },
  { status: 'In Shop', count: 5, tone: 'warning' },
  { status: 'Retired', count: 2, tone: 'danger' },
];

export const filterOptions = {
  vehicleType: ['All', 'Van', 'Truck', 'Mini'],
  status: ['All', 'Available', 'On Trip', 'In Shop', 'Retired'],
  region: ['All', 'Gandhinagar', 'Ahmedabad', 'Vatva', 'Mansa'],
};

// ---- Vehicle Registry ----------------------------------------------------
export const initialVehicles = [
  { regNo: 'GJ01AB4521', name: 'VAN-05', type: 'Van', capacityKg: 500, odometer: 74000, acqCost: 620000, status: 'Available' },
  { regNo: 'GJ01AB9981', name: 'TRUCK-11', type: 'Truck', capacityKg: 5000, odometer: 182000, acqCost: 2450000, status: 'On Trip' },
  { regNo: 'GJ01AB1120', name: 'MINI-03', type: 'Mini', capacityKg: 1000, odometer: 66000, acqCost: 410000, status: 'In Shop' },
  { regNo: 'GJ01AB0008', name: 'VAN-09', type: 'Van', capacityKg: 750, odometer: 241900, acqCost: 590000, status: 'Retired' },
];

export const VEHICLE_TYPES = ['Van', 'Truck', 'Mini'];
export const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];

// ---- Drivers & Safety Profiles -------------------------------------------
export const initialDrivers = [
  { name: 'Alex', license: 'DL-88213', category: 'LMV', expiry: '2028-12-01', contact: '98765xxxxx', tripCompletion: 96, safety: 'Available', status: 'Available' },
  { name: 'John', license: 'DL-44120', category: 'HMV', expiry: '2025-03-01', contact: '98220xxxxx', tripCompletion: 81, safety: 'Suspended', status: 'Suspended' },
  { name: 'Priya', license: 'DL-77031', category: 'LMV', expiry: '2021-08-01', contact: '99910xxxxx', tripCompletion: 99, safety: 'On Trip', status: 'On Trip' },
  { name: 'Suresh', license: 'DL-90045', category: 'HMV', expiry: '2027-01-01', contact: '97440xxxxx', tripCompletion: 88, safety: 'Available', status: 'Off Duty' },
];

export const DRIVER_STATUS_TOGGLES = ['Available', 'On Trip', 'Off Duty', 'Suspended'];

export const isLicenseExpired = (expiry) => new Date(expiry) < new Date();

// ---- Trips ----------------------------------------------------------------
export const initialTripBoard = [
  { id: 'TR001', source: 'Gandhinagar Depot', destination: 'Ahmedabad Hub', vehicle: 'VAN-05', driver: 'Alex', status: 'Dispatched', note: '45 min' },
  { id: 'TR004', source: 'Vatva Industrial Area', destination: 'Sanand Warehouse', vehicle: 'TRUCK-04', driver: 'Suresh', status: 'Draft', note: 'Awaiting driver' },
  { id: 'TR006', source: 'Mansa', destination: 'Kalol Depot', vehicle: '—', driver: 'Unassigned', status: 'Cancelled', note: 'Vehicle went to shop' },
];

export const TRIP_LIFECYCLE = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

// ---- Maintenance ------------------------------------------------------------
export const initialServiceLogs = [
  { vehicle: 'VAN-05', service: 'Oil Change', cost: 2500, date: '2026-07-07', status: 'In Shop' },
  { vehicle: 'TRUCK-11', service: 'Engine Repair', cost: 18000, date: '2026-07-05', status: 'Completed' },
  { vehicle: 'MINI-03', service: 'Tyre Replace', cost: 6200, date: '2026-07-06', status: 'In Shop' },
];

// ---- Fuel & Expenses --------------------------------------------------------
export const initialFuelLogs = [
  { vehicle: 'VAN-05', date: '2026-07-05', liters: 42, cost: 3150 },
  { vehicle: 'TRUCK-11', date: '2026-07-06', liters: 110, cost: 8400 },
  { vehicle: 'MINI-08', date: '2026-07-06', liters: 28, cost: 2050 },
];

export const initialOtherExpenses = [
  { trip: 'TR001', vehicle: 'VAN-05', toll: 120, other: 0, maintLinked: 0 },
  { trip: 'TR002', vehicle: 'TRK-12', toll: 340, other: 150, maintLinked: 18000 },
];

// ---- Reports & Analytics -----------------------------------------------------
export const analyticsSummary = {
  fuelEfficiency: '8.4 km/l',
  fleetUtilization: '81%',
  operationalCost: 34070,
  vehicleRoi: '14.2%',
};

export const monthlyRevenue = [
  { month: 'Jan', value: 48 },
  { month: 'Feb', value: 56 },
  { month: 'Mar', value: 71 },
  { month: 'Apr', value: 78 },
  { month: 'May', value: 65 },
  { month: 'Jun', value: 88 },
  { month: 'Jul', value: 82 },
];

export const topCostliestVehicles = [
  { vehicle: 'TRUCK-11', cost: 26400, tone: 'danger' },
  { vehicle: 'MINI-03', cost: 11900, tone: 'warning' },
  { vehicle: 'VAN-05', cost: 5670, tone: 'info' },
];

// ---- Settings & RBAC ----------------------------------------------------------
export const depotSettings = {
  depotName: 'Gandhinagar Depot GJ4',
  currency: 'INR (₹)',
  distanceUnit: 'Kilometers',
};

export const rbacMatrix = [
  { role: 'Fleet Manager', fleet: 'full', drivers: 'full', trips: 'none', fuelExp: 'none', analytics: 'full' },
  { role: 'Dispatcher', fleet: 'view', drivers: 'none', trips: 'full', fuelExp: 'none', analytics: 'none' },
  { role: 'Safety Officer', fleet: 'none', drivers: 'full', trips: 'view', fuelExp: 'none', analytics: 'none' },
  { role: 'Financial Analyst', fleet: 'view', drivers: 'none', trips: 'none', fuelExp: 'full', analytics: 'full' },
];

// ---- Auth ------------------------------------------------------------------
export const roleDestinations = [
  { role: 'Fleet Manager', goesTo: 'Fleet, Maintenance, Analytics' },
  { role: 'Dispatcher', goesTo: 'Dashboard, Trips' },
  { role: 'Safety Officer', goesTo: 'Drivers, Trips (view)' },
  { role: 'Financial Analyst', goesTo: 'Fuel & Expenses, Analytics' },
];
