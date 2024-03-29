import axiosClient from './axiosClient';
import { IFood, IFoods } from 'utils/interface';

const foodApi = {
  getAll(page?: number, categoryId?: string, search?: string) {
    const url: string = `/food?page=${page || ''}&category=${
      categoryId || ''
    }&search=${search || ''}`;
    return axiosClient.get<IFoods>(url);
  },

  get(id: string) {
    const url: string = `/food/${id}`;
    return axiosClient.get<IFood>(url);
  },

  add(data: any) {
    const url: string = '/admin/food';
    return axiosClient.post<IFood>(url, data);
  },

  update(id: string, data: any) {
    const url: string = `/admin/food/${id}`;
    return axiosClient.put<IFood>(url, data);
  },

  remove(id: string) {
    const url: string = `/admin/food/${id}`;
    return axiosClient.delete<IFood>(url);
  },
};

export default foodApi;
