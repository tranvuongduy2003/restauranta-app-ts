import Heading from 'pages/Dashboard/Heading';
import React, { useState, useEffect } from 'react';
import Search from 'components/Search';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Table from 'components/Table';
import Pagination from 'components/Pagination';
import orderApi from 'api/orderApi';
import { IOrder } from 'utils/interface';
import Status from 'components/status/Status';
import { Dropdown } from 'components/dropdown';
import DeleteAction from 'components/actions/DeleteAction';
import UpdateAction from 'components/order-modal/actions/UpdateAction';
import ViewAction from 'components/actions/ViewAction';
import ViewModal from 'components/order-modal/ViewModal';

interface IOrderPageProps {}

const OrderPage: React.FunctionComponent<IOrderPageProps> = (props) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    try {
      const handleFetchData = async () => {
        setLoading(true);
        const data: any = await orderApi.getAll(1);
        const { orders, totalItems } = data;
        setOrders(orders);
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
        const data: any = await orderApi.getAll(page, search, selectedStatus);
        const { orders, totalItems } = data;
        setOrders(orders);
        setTotalItems(totalItems);
        setLoading(false);
      };
      handleFetchData();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [page, search, selectedStatus]);

  const handleDeleteOrder = async (id: string) => {
    try {
      if (id) {
        await orderApi.deleteOrder(id);
        toast.success('Xóa người dùng thành công!');
      } else {
        throw new Error('id not found');
      }
      navigate(0);
    } catch (error) {
      toast.error('Xóa người dùng thất bại!');
      console.log(error);
    }
  };

  return (
    <div>
      <Heading title="Đơn hàng" desc="Quản lý toàn bộ đơn hàng"></Heading>
      <div className="flex items-center justify-start gap-5 mb-10">
        <div className="flex items-center flex-1 gap-5">
          <div className="w-full max-w-[300px]">
            <Search
              handleInputChange={setSearch}
              name="search"
              placeholder="Tìm kiếm đơn hàng..."
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
            <th>Người đặt</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Phương thức</th>
            <th>Tình trạng</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {!loading ? (
            orders?.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  <span className="text-gray-500">{order.name}</span>
                </td>
                <td>
                  <span className="text-gray-500">{order.phoneNumber}</span>
                </td>
                <td>
                  <span className="text-gray-500">{order.address}</span>
                </td>
                <td>
                  <span className="text-gray-500">{order.action}</span>
                </td>
                <td>
                  <span className="text-gray-500">{order.method}</span>
                </td>
                <td>
                  <Status statusProps={order.status}></Status>
                </td>
                <td>
                  <span className="text-gray-500">
                    {order.totalPrice?.toString()}
                  </span>
                </td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ViewAction>
                      <ViewModal item={order}></ViewModal>
                    </ViewAction>
                    <UpdateAction item={order}></UpdateAction>
                    <DeleteAction
                      onClick={() => handleDeleteOrder(order._id as string)}
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

export default OrderPage;
