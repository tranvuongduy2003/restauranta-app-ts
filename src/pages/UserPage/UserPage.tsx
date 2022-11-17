import Table from 'components/Table';
import Heading from 'pages/Dashboard/Heading';
import React, { useEffect, useState } from 'react';
import Search from 'components/Search';
import userApi from 'api/userApi';
import { IUser } from 'utils/interface';

const UserPage: React.FC = () => {
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
            <th>Info</th>
            <th>Email address</th>
            <th>Phone number</th>
            <th>Actions</th>
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
                      src="https://tinhayvip.com/wp-content/uploads/2022/04/meme-ech-xanh-5.jpg"
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
                  <span className="text-gray-500">0999999999</span>
                </td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    {/* Chua lam */}
                    {/* <ViewAction></ViewAction>
                    <UpdateAction></UpdateAction>
                    <DeleteAction></DeleteAction> */}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UserPage;
