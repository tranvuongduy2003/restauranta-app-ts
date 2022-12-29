import axiosClient from './axiosClient';

const orderApi = {
  getAll(page?: number, search?: string, status?: string) {
    const url: string = `/order?page=${page || ''}&status=${
      status || ''
    }&search=${search || ''}`;
    return axiosClient.get(url);
  },

  deleteOrder(id: string) {
    const url: string = `/order/${id}`;
    return axiosClient.delete(url);
  },

  updateOrder(id: string, payload: any) {
    const url: string = `/order/${id}`;
    return axiosClient.put(url, payload);
  },

  deleteItemFromOrder(orderId: string, items: any) {
    const url: string = `order/${orderId}`;
    return axiosClient.post(url, items);
  },
};

export default orderApi;
