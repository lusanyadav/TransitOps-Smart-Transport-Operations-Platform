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
