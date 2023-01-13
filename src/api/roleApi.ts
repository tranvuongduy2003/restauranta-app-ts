import { IRole } from 'utils/interface';
import axiosClient from './axiosClient';

const roleApi = {
  getAll(page?: number) {
    const url: string = `/admin/roles?page=${page || ''}`;
    return axiosClient.get(url);
  },

  update(id?: string, payload?: IRole) {
    const url: string = `/admin/roles/${id || ''}`;
    return axiosClient.put(url, payload);
  },

  create(payload?: IRole) {
    const url: string = `/admin/roles`;
    return axiosClient.post(url, payload);
  },
};

export default roleApi;
