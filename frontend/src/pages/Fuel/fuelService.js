
import axios from "axios";

const API = "http://localhost:5555/api/common";

const authHeader = () => ({
  Authorization: `${localStorage.getItem("token")}`,
});

export const getFuel = async (page = 1, pageSize = 5) => {
  const res = await axios.get(API, {
    headers: authHeader(),

    params: {
      table: "fuel",
      page,
      pageSize,
      whereClause: "1=1",
      orderby: "update_dt desc",
    },
  });

  return res.data.data;
};

export const createFuel = async (fuel) => {
  return axios.post(
    API,
    {
      table: "fuel",
      records: fuel,
    },
    {
      headers: authHeader(),
    },
  );
};

export const updateFuel = async (id, fuel) => {
  return axios.put(
    `${API}/${id}`,
    {
      table: "fuel",
      records: fuel,
    },
    {
      headers: authHeader(),
    },
  );
};

export const deleteFuel = async (id) => {
  return axios.delete(API, {
    headers: authHeader(),
    data: {
      table: "fuel",
      whereClause: `fuel_id = ${id}`,
    },
  });
};