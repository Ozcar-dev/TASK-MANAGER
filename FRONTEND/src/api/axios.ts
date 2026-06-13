import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-3q6n.onrender.com",
});

export default api;