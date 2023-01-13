import Table from 'components/Table';
import Heading from 'pages/Dashboard/Heading';
import React, { useEffect, useState } from 'react';
import Search from 'components/Search';
import userApi from 'api/userApi';
import { IUser } from 'utils/interface';
import Pagination from 'components/Pagination';
import UserSkeleton from 'components/skeleton/UserSkeleton';
import DeleteAction from 'components/actions/DeleteAction';
import UpdateAction from 'components/user-modal/actions/UpdateAction';
import ViewAction from 'components/actions/ViewAction';
import ViewModal from 'components/user-modal/ViewModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const handleFetchData = async () => {
        setLoading(true);
        const data: any = await userApi.getAll(1);
        const { users, totalItems } = data;
        setUsers(users);
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
        const data: any = await userApi.getAll(page, search);
        const { users } = data;
        setUsers(users);
        setLoading(false);
      };
      handleFetchData();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [page, search]);

  const handleDeleteUser = async (id: string) => {
    try {
      if (id) {
        await userApi.deleteUser(id);
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
      <Heading title="Người dùng" desc="Quản lý tất cả người dùng"></Heading>
      <div className="flex items-center justify-start gap-5 mb-10">
        <div className="w-full max-w-[300px]">
          <Search
            handleInputChange={setSearch}
            name="search"
            placeholder="Tìm kiếm người dùng..."
          ></Search>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Thông tin</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {!loading ? (
            users?.length > 0 &&
            users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={`${
                        user.avatar?.url !== ''
                          ? user.avatar?.url
                          : 'https://tinhayvip.com/wp-content/uploads/2022/04/meme-ech-xanh-5.jpg'
                      }`}
                      alt=""
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <time className="text-sm text-gray-500">
                        {user.createdAt &&
                          new Date(user.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-gray-500">{user.email}</span>
                </td>
                <td>
                  <span className="text-gray-500">{user.phoneNumber}</span>
                </td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ViewAction>
                      <ViewModal item={user}></ViewModal>
                    </ViewAction>
                    <UpdateAction item={user}></UpdateAction>
                    <DeleteAction
                      onClick={() => handleDeleteUser(user._id || '')}
                    ></DeleteAction>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <>
              <UserSkeleton></UserSkeleton>
              <UserSkeleton></UserSkeleton>
              <UserSkeleton></UserSkeleton>
              <UserSkeleton></UserSkeleton>
            </>
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

export default UserPage;
