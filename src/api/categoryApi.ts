import axiosClient from './axiosClient';

const categoryApi = {
  getAll(page?: number, search?: string) {
    const url: string = `/category?page=${page || ''}&search=${search || ''}`;
    return axiosClient.get(url);
  },

  get(id: string) {
    const url: string = `/category/${id}`;
    return axiosClient.get(url);
  },

  add(data: any) {
    const url: string = '/admin/category';
    return axiosClient.post(url, data);
  },

  update(id: string, data: any) {
    const url = `/admin/category/${id}`;
    return axiosClient.put(url, data);
  },

  remove(id: string) {
    const url: string = `/admin/category/${id}`;
    return axiosClient.delete(url);
  },
};

export default categoryApi;
