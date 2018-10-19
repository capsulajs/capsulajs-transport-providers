import axios from 'axios';

import { Dispatcher } from '../api';

export class AxiosDispatcher extends Dispatcher {
  dispatch<T, R>(request: T, api: string): Promise<R> {
    return axios.post(this.baseUrl + api, request)
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  }
};
