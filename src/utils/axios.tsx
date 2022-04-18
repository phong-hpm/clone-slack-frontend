import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

export default instance;
