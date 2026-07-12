import axios from "axios";

const API = "http://localhost:5555/api/common";

const authHeader = () => ({
  Authorization: `${localStorage.getItem("token")}`,
});

export const getMaintenanceLogs = async (page = 1, pageSize = 100) => {
  const res = await axios.get(API, {
    headers: authHeader(),
    params: {
      table: "maintenance",
      page,
      pageSize,
      whereClause: "1=1",
      orderby: "update_dt desc",
    },
  });
  return res.data.data;
};

export const getVehicles = async (page = 1, pageSize = 100) => {
  const res = await axios.get(API, {
    headers: authHeader(),
    params: {
      table: "vehicle",
      page,
      pageSize,
      whereClause: "1=1",
      orderby: "update_dt desc",
    },
  });
  return res.data.data;
};

export const createMaintenance = async (record) => {
  return axios.post(
    API,
    {
      table: "maintenance",
      records: record,
    },
    {
      headers: authHeader(),
    }
  );
};

export const updateMaintenance = async (id, record) => {
  return axios.put(
    `${API}/${id}`,
    {
      table: "maintenance",
      records: record,
    },
    {
      headers: authHeader(),
    }
  );
};

export const deleteMaintenance = async (id) => {
  return axios.delete(API, {
    headers: authHeader(),
    data: {
      table: "maintenance",
      whereClause: `maintenance_id = ${id}`,
    },
  });
};
