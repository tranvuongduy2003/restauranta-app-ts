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

  logout(id: any) {
    const url = `/auth/logout/${id}`;
    return axiosClient.post(url);
  },

  refreshToken(refreshToken: string) {
    const url = '/auth/refresh';
    return axiosClient.post(url, refreshToken);
  },

  get(id: string) {
    const url = `/auth/user/${id}`;
    return axiosClient.get(url);
  },
};

export default userApi;
