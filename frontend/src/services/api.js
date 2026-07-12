import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const session = JSON.parse(
    localStorage.getItem("transitops.session") ||
      sessionStorage.getItem("transitops.session") ||
      "null"
  );

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("transitops.session");
      sessionStorage.removeItem("transitops.session");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;