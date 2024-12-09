import axios from "axios";

// Configura a URL base da API usando a variável de ambiente
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // URL do Heroku em produção ou localhost em desenvolvimento
});

// Adicionar o token automaticamente nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
