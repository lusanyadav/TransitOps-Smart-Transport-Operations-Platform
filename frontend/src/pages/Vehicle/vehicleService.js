import axios from "axios";

const API = "http://localhost:5555/api/common";

const authHeader = () => ({
  Authorization: localStorage.getItem("token"),
});

// Get Vehicles
export const getVehicles = async (page = 1, pageSize = 1000) => {
  const res = await axios.get(API, {
    headers: authHeader(),
    params: {
      table: "vehicle",
      page,
      pageSize,
      whereClause: "1=1",
      orderby: "update_dt DESC",
    },
  });

  return res.data;
};

// Get Single Vehicle
export const getVehicle = async (id) => {
  const res = await axios.get(`${API}/${id}`, {
    headers: authHeader(),
    params: {
      table: "vehicle",
      idField: "vehicle_id",
    },
  });

  return res.data.data;
};

// Create Vehicle
export const createVehicle = async (vehicle) => {
  return axios.post(
    API,
    {
      table: "vehicle",
      records: vehicle,
    },
    {
      headers: authHeader(),
    }
  );
};

// Update Vehicle
export const updateVehicle = async (id, vehicle) => {
  return axios.put(
    `${API}/${id}`,
    {
      table: "vehicle",
      records: vehicle,
    },
    {
      headers: authHeader(),
    }
  );
};

// Delete Vehicle
export const deleteVehicle = async (id) => {
  return axios.delete(API, {
    headers: authHeader(),
    data: {
      table: "vehicle",
      whereClause: `vehicle_id = ${id}`,
    },
  });
};