import Axios from 'axios';

export const axiosClient = Axios.create({
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
