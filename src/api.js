import axios from "axios";

// Correct base URL
const BASE_URL = "https://inventory-frontend-1-80l6.onrender.com/api/items";

// Configure axios to attach token if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all items
export const getItems = () => axios.get(BASE_URL);

// Add new item
export const addItem = (item) => axios.post(BASE_URL, item);

// Update item
export const updateItem = (id, item) => axios.put(`${BASE_URL}/${id}`, item);

// Delete item
export const deleteItem = (id) => {
  if (!id) {
    throw new Error("Item ID is required for deletion");
  }
  return axios.delete(`${BASE_URL}/${id}`);
};
