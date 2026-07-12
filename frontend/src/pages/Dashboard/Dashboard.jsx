import { useEffect, useMemo, useState } from "react";
import {
  Truck,
  CheckCircle2,
  Wrench,
  Route,
  Clock,
  Users,
  Gauge,
} from "lucide-react";

import DashboardCard from "@/components/cards/DashboardCard";
import StatusBadge from "@/components/status/StatusBadge";
import Select from "@/components/forms/Select/Select";

import { filterOptions, VEHICLE_TYPES } from "@/services/mockData";
import { getDrivers, getVehicles } from "../Driver/driverService";
import { getTrips } from "../Trip/tripService";

const STATUS_TONE_BAR = {
  Available: "bg-status-success",
  "On Trip": "bg-status-info",
  "In Shop": "bg-status-warning",
  Retired: "bg-status-danger",
};

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);

  const [vehicleType, setVehicleType] = useState("All");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");
  const getVehicleLabel = (id) => {
  const vehicle = vehicles.find(
        (v) => String(v.vehicle_id) === String(id)
      );

      return vehicle?.vehicle_no || id;
  };
  const getDriverLabel = (id) => {
    const driver = drivers.find(
      (v) => String(v.driver_id) === String(id)
    );

    return driver?.driver_name || id;
  };

  const getTripSourceLabel = (id) => {
    const trip = trips.find(
      (v) => String(v.trip_id) === String(id)
    );

    return trip?.source + " to " + trip?.destination || id;
};
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [vehicleData, driverData, tripData] = await Promise.all([
          getVehicles(),
          getDrivers(),
          getTrips(),
        ]);

        setVehicles(vehicleData || []);
        setDrivers(driverData || []);
        setTrips(tripData || []);
      } catch (error) {
        console.error("Dashboard loading failed", error);
      }
    };

    loadDashboard();
  }, []);

  const kpis = useMemo(() => {
    const active = vehicles.filter((v) => v.status !== "Retired").length;

    const available = vehicles.filter((v) => v.status === "Available").length;

    const inMaintenance = vehicles.filter((v) => v.status === "In Shop").length;

    const activeTrips = trips.filter((t) => t.status === "Dispatched").length;

    const pendingTrips = trips.filter((t) => t.status === "Draft").length;

    const driversOnDuty = drivers.filter(
      (d) => d.status === "Available" || d.status === "On Trip",
    ).length;

    const utilization = active
      ? Math.round(
          (vehicles.filter((v) => v.status === "On Trip").length / active) *
            100,
        )
      : 0;

    return [
      {
        key: "activeVehicles",
        label: "Active Vehicles",
        value: String(active).padStart(2, "0"),
        accent: "info",
        icon: Truck,
      },
      {
        key: "availableVehicles",
        label: "Available Vehicles",
        value: String(available).padStart(2, "0"),
        accent: "success",
        icon: CheckCircle2,
      },
      {
        key: "vehiclesInMaintenance",
        label: "Vehicles in Maintenance",
        value: String(inMaintenance).padStart(2, "0"),
        accent: "warning",
        icon: Wrench,
      },
      {
        key: "activeTrips",
        label: "Active Trips",
        value: String(activeTrips).padStart(2, "0"),
        accent: "info",
        icon: Route,
      },
      {
        key: "pendingTrips",
        label: "Pending Trips",
        value: String(pendingTrips).padStart(2, "0"),
        accent: "warning",
        icon: Clock,
      },
      {
        key: "driversOnDuty",
        label: "Drivers On Duty",
        value: String(driversOnDuty).padStart(2, "0"),
        accent: "success",
        icon: Users,
      },
      {
        key: "fleetUtilization",
        label: "Fleet Utilization",
        value: `${utilization}%`,
        accent: "amber",
        icon: Gauge,
      },
    ];
  }, [vehicles, drivers, trips]);

  const vehicleStatusBreakdown = useMemo(() => {
    const counts = {
      Available: 0,
      "On Trip": 0,
      "In Shop": 0,
      Retired: 0,
    };

    vehicles.forEach((v) => {
      counts[v.status] = (counts[v.status] || 0) + 1;
    });

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [vehicles]);

  const filteredTrips = trips
    .filter((t) =>
      vehicleType === "All"
        ? true
        : vehicles.find((v) => v.name === t.vehicle)?.type === vehicleType,
    )
    .filter((t) => (status === "All" ? true : t.status === status))
    .slice(0, 5);

  const totalVehicles = Math.max(vehicles.length, 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-900">Dashboard</h1>
          <p className="text-sm text-text-400">
            Live overview of fleet, trips and drivers.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-400">
          Filters
        </span>
        <Select
          label="Vehicle Type"
          options={["All", ...VEHICLE_TYPES]}
          value={vehicleType}
          onChange={setVehicleType}
        />
        <Select
          label="Status"
          options={filterOptions.status}
          value={status}
          onChange={setStatus}
        />
        <Select
          label="Region"
          options={filterOptions.region}
          value={region}
          onChange={setRegion}
        />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {kpis.map((kpi) => (
          <DashboardCard
            key={kpi.key}
            label={kpi.label}
            value={kpi.value}
            accent={kpi.accent}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Recent trips + vehicle status */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-900">
              Recent Trips
            </h2>
            <span className="text-xs text-text-400">
              {filteredTrips.length} trips
            </span>
          </div>
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-soft text-left text-[11px] uppercase tracking-wide text-text-400">
                  <th className="py-2 pr-3 font-medium">Trip</th>
                  <th className="py-2 pr-3 font-medium">Vehicle</th>
                  <th className="py-2 pr-3 font-medium">Driver</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-b border-line-soft last:border-0"
                  >
                    <td className="py-2.5 pr-3 font-mono text-xs font-medium text-text-900">
                      {getTripSourceLabel(trip.trip_id)}
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-text-600">
                      {getVehicleLabel(trip.vehicle_id)}
                    </td>
                    <td className="py-2.5 pr-3 text-text-600">{getDriverLabel(trip.driver_id)}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="py-2.5 pr-3 text-text-400">{trip.remark}</td>
                  </tr>
                ))}
                {filteredTrips.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-sm text-text-400"
                    >
                      No trips match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text-900">
            Vehicle Status
          </h2>
          <div className="space-y-3">
            {vehicleStatusBreakdown.map((v) => (
              <div key={v.status}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-text-600">{v.status}</span>
                  <span className="font-mono font-medium text-text-900">
                    {v.count}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
                  <div
                    className={`h-full rounded-full ${STATUS_TONE_BAR[v.status]}`}
                    style={{ width: `${(v.count / totalVehicles) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
