import axios from "axios";

const API = "http://localhost:5555/api/common";

const authHeader = () => ({
  Authorization: `${localStorage.getItem("token")}`,
});

export const getDrivers = async (page = 1, pageSize = 5) => {
  const res = await axios.get(API, {
    headers: authHeader(),

    params: {
      table: "driver",
      page,
      pageSize,
      whereClause: "1=1",
      orderby: "update_dt desc",
    },
  });

  return res.data.data;
};

export const getVehicles = async (page = 1, pageSize = 5) => {
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

export const createDriver = async (driver) => {
  return axios.post(
    API,
    {
      table: "driver",
      records: driver,
    },
    {
      headers: authHeader(),
    },
  );
};

export const updateDriver = async (id, driver) => {
  return axios.put(
    `${API}/${id}`,
    {
      table: "driver",
      records: driver,
    },
    {
      headers: authHeader(),
    },
  );
};

export const deleteDriver = async (id) => {
  return axios.delete(API, {
    headers: authHeader(),
    data: {
      table: "driver",
      whereClause: `driver_id = ${id}`,
    },
  });
};
