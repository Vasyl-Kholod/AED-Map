import axios from 'axios';
import { paramsInterceptor } from './params-interceptor';

const http = {
  get(url, params, cancel) {
    const cleanParams = paramsInterceptor(params);
    return axios({
      method: 'get',
      url,
      params: cleanParams,
      cancelToken: cancel ? cancel.token : null
    });
  },
  post(url, params, cancel) {
    return axios({
      method: 'post',
      url,
      data: params,
      cancelToken: cancel ? cancel.token : null
    });
  },
  postFormData(url, params, cancel) {
    return axios({
      method: 'post',
      url,
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' },
      cancelToken: cancel ? cancel.token : null
    });
  },
  delete(url, params, cancel) {
    return axios({
      method: 'delete',
      url,
      data: params,
      cancelToken: cancel ? cancel.token : null
    });
  },
  put(url, params, cancel) {
    return axios({
      method: 'put',
      url,
      data: params,
      cancelToken: cancel ? cancel.token : null
    });
  }
};

export default http;
