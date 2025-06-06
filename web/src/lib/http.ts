import ky from 'ky';

const http = ky.create({
  prefixUrl: `${import.meta.env.VITE_API_URL}`,
  timeout: false,
  retry: 0,
  credentials: 'include'
});

export default http;
