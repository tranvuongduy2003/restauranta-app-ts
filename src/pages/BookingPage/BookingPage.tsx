import Heading from 'pages/Dashboard/Heading';
import React, { useState, useEffect } from 'react';
import Search from 'components/Search';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Table from 'components/Table';
import Pagination from 'components/Pagination';
import reservationApi from 'api/reservationApi';
import DeleteAction from 'components/actions/DeleteAction';
import { IReservation } from 'utils/interface';
import Status from 'components/status/Status';
import ViewAction from 'components/actions/ViewAction';
import ViewModal from 'components/reservation-model/ViewModal';
import UpdateAction from 'components/reservation-model/actions/UpdateAction';
import { Dropdown } from 'components/dropdown';

interface IBookingPageProps {}

const BookingPage: React.FunctionComponent<IBookingPageProps> = (props) => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    try {
      const handleFetchData = async () => {
        setLoading(true);
        const data: any = await reservationApi.getAll(1);
        const { reservations, totalItems } = data;
        setReservations(reservations);
        setTotalItems(totalItems);
        setLoading(false);
      };
      handleFetchData();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    try {
      const handleFetchData = async () => {
        setLoading(true);
        const data: any = await reservationApi.getAll(
          page,
          search,
          selectedStatus
        );
        const { reservations, totalItems } = data;
        setReservations(reservations);
        setTotalItems(totalItems);
        setLoading(false);
      };
      handleFetchData();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [page, search, selectedStatus]);

  const handleDeleteReservation = async (id: string) => {
    try {
      if (id) {
        await reservationApi.deleteReservation(id);
      } else {
        throw new Error('id not found');
      }
      toast.success('Xóa người dùng thành công!');
      navigate(0);
    } catch (error) {
      toast.error('Xóa người dùng thất bại!');
      console.log(error);
    }
  };

  return (
    <div>
      <Heading title="Đặt chỗ" desc="Quản lý lịch đặt chỗ"></Heading>
      <div className="flex items-center justify-start gap-5 mb-10">
        <div className="flex items-center flex-1 gap-5">
          <div className="w-full max-w-[300px]">
            <Search
              handleInputChange={setSearch}
              name="search"
              placeholder="Tìm kiếm đơn đặt..."
            ></Search>
          </div>
        </div>
        <div className="w-full max-w-[220px]">
          <Dropdown>
            <Dropdown.Select
              placeholder={`${
                selectedStatus === ''
                  ? 'Trạng thái'
                  : selectedStatus.charAt(0).toUpperCase() +
                    selectedStatus.slice(1)
              }`}
            ></Dropdown.Select>
            <Dropdown.List>
              <Dropdown.Option onClick={() => setSelectedStatus('accepted')}>
                Accepted
              </Dropdown.Option>
              <Dropdown.Option onClick={() => setSelectedStatus('pending')}>
                Pending
              </Dropdown.Option>
              <Dropdown.Option onClick={() => setSelectedStatus('rejected')}>
                Rejected
              </Dropdown.Option>
              <Dropdown.Option onClick={() => setSelectedStatus('')}>
                Tất cả
              </Dropdown.Option>
            </Dropdown.List>
          </Dropdown>
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Họ tên</th>
            <th>Ngày đặt</th>
            <th>Thời gian</th>
            <th>Số lượng</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {!loading ? (
            reservations?.length > 0 &&
            reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation._id}</td>
                <td>
                  <span className="text-gray-500">{reservation.name}</span>
                </td>
                <td>
                  <span className="text-gray-500">
                    {reservation.bookingDate}
                  </span>
                </td>
                <td>
                  <span className="text-gray-500">
                    {reservation.bookingTime}
                  </span>
                </td>
                <td>
                  <span className="text-gray-500">{reservation.quantity}</span>
                </td>
                <td>
                  <Status statusProps={reservation.status}></Status>
                </td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ViewAction>
                      <ViewModal item={reservation}></ViewModal>
                    </ViewAction>
                    <UpdateAction item={reservation}></UpdateAction>
                    <DeleteAction
                      onClick={() =>
                        handleDeleteReservation(reservation._id as string)
                      }
                    ></DeleteAction>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </Table>
      <Pagination
        currentPage={page}
        lastPage={Math.ceil((totalItems === 0 ? 1 : totalItems) / 5)}
        increase={() => {
          page !== Math.ceil(totalItems / 5) && setPage(page + 1);
        }}
        decrease={() => {
          page !== 1 && setPage(page - 1);
        }}
      ></Pagination>
    </div>
  );
};

export default BookingPage;
