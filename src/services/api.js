import axios from 'axios';
import {server} from '../utils/common';

const api = axios.create({
  baseURL: server,
  timeout: 7000,
});

export default api;
