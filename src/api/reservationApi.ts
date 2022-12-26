import axiosClient from './axiosClient';

const reservationApi = {
  getAll(page?: number, search?: string, status?: string) {
    const url: string = `/reservation?page=${page || ''}&status=${
      status || ''
    }&search=${search || ''}`;
    return axiosClient.get(url);
  },

  deleteReservation(id: string) {
    const url: string = `/reservation/${id}`;
    return axiosClient.delete(url);
  },

  updateReservation(id: string, payload: any) {
    const url: string = `/reservation/${id}`;
    return axiosClient.put(url, payload);
  },
};

export default reservationApi;
