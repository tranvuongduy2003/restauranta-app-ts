import axiosClient from './axiosClient';

const userApi = {
  getAll(page?: number, search?: string) {
    const url: string = `/admin/user?page=${page || ''}&search=${search || ''}`;
    return axiosClient.get(url);
  },

  login(data: any) {
    const url = '/auth/login';
    return axiosClient.post(url, data);
  },
};

export default userApi;
