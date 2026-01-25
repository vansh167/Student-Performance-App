import axios from "axios";

const API = "https://student-performance-backend-xgvt.onrender.com";

export const uploadResource = async (formData, token) => {
  return axios.post(`${API}/admin/resources/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getResources = async () => {
  return axios.get(`${API}/resources`);
};
