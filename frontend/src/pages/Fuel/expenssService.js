
import axios from "axios";

const API = "http://localhost:5555/api/common";

const authHeader = () => ({
  Authorization: `${localStorage.getItem("token")}`,
});

export const getExpenses = async (page = 1, pageSize = 5) => {
  const res = await axios.get(API, {
    headers: authHeader(),

    params: {
      table: "expense",
      page,
      pageSize,
      whereClause: "1=1",
      orderby: "update_dt desc",
    },
  });

  return res.data.data;
};

export const createExpense = async (expense) => {
  return axios.post(
    API,
    {
      table: "expense",
      records: expense,
    },
    {
      headers: authHeader(),
    },
  );
};

export const updateExpense = async (id, expense) => {
  return axios.put(
    `${API}/${id}`,
    {
      table: "expense",
      records: expense,
    },
    {
      headers: authHeader(),
    },
  );
};

export const deleteExpense = async (id) => {
  return axios.delete(API, {
    headers: authHeader(),
    data: {
      table: "expense",
      whereClause: `expense_id = ${id}`,
    },
  });
};