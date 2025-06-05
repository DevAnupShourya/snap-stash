import ky from 'ky';

const http = ky.create({
  prefixUrl: `${import.meta.env.VITE_API_URL}`,
  timeout: false,
  retry: 0,
  hooks: {
    // TODO : later in auth maybe useful
    // beforeRequest: [
    //   request => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //       request.headers.set('Authorization', `Bearer ${token}`);
    //     }
    //   },
    // ],
  },
});

export default http;
