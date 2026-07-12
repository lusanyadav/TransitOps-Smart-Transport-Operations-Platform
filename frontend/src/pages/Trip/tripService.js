import axios from "axios";

const API = "http://localhost:5555/api/common";

const authHeader = () => ({
  Authorization: `${localStorage.getItem("token")}`,
});

export const getTrips = async (
  page = 1,
  pageSize = 5
) => {
  const res = await axios.get(API, {
    headers: authHeader(),
    params: {
      table: "trip",
      page,
      pageSize,
      whereClause: "1=1",
      orderby: "update_dt desc",
    },
  });

  return res.data.data;
};


export const createTrip = async (trip) => {
  return axios.post(
    API,
    {
      table: "trip",
      records: trip,
    },
    {
      headers: authHeader(),
    }
  );
};


export const updateTrip = async (id, trip) => {
  return axios.put(
    `${API}/${id}`,
    {
      table: "trip",
      records: trip,
    },
    {
      headers: authHeader(),
    }
  );
};


export const deleteTrip = async (id) => {
  return axios.delete(API, {
    headers: authHeader(),
    data: {
      table: "trip",
      whereClause: `trip_id = ${id}`,
    },
  });
};