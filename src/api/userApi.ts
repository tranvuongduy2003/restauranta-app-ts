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
    return axiosClient.post(url, { refreshToken });
  },

  get(id: string) {
    const url = `/auth/user/${id}`;
    return axiosClient.get(url);
  },

  deleteUser(id: string) {
    const url = `admin/user/${id}`;
    return axiosClient.delete(url);
  },

  deleteUserPermanently(id: string) {
    const url = `admin/user/bin/${id}`;
    return axiosClient.delete(url);
  },

  editUser(id: string, payload: any) {
    const url = `/admin/user/${id}`;
    return axiosClient.put(url, payload);
  },

  getDeletedUser(page?: number, search?: string) {
    const url: string = `/admin/user/bin?page=${page || ''}&search=${
      search || ''
    }`;
    return axiosClient.get(url);
  },

  recover(id: string) {
    const url: string = `/admin/user/${id}`;
    return axiosClient.post(url);
  },
};

export default userApi;
