import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
console.log('🔗 API_URL:', API_URL);

const request = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(config => {
  console.log('🟡 Отправка запроса:', config.method?.toUpperCase(), config.url);
  console.log('Данные:', config.data);

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  response => {
    console.log('✅ Получен ответ:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ Ошибка ответа:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default request;
