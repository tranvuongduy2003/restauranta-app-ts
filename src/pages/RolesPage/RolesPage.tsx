import Heading from 'pages/Dashboard/Heading';
import React, { useEffect, useState } from 'react';
import Table from 'components/Table';
import Pagination from 'components/Pagination';
import Checked from 'components/Checked';
import UpdateAction from 'components/roles-modal/actions/UpdateAction';
import roleApi from 'api/roleApi';
import { IRole } from 'utils/interface';
import Button from 'components/Button';
import Modal from 'components/modal/Modal';
import AddModal from 'components/roles-modal/AddModal';

interface IRolesPageProps {}

const RolesPage: React.FunctionComponent<IRolesPageProps> = (props) => {
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const handleFetchData = async () => {
        const data: any = await roleApi.getAll(page);
        const { roles, totalItems } = data;
        setRoles(roles);
        setTotalItems(totalItems);
      };
      handleFetchData();
    } catch (error) {
      console.error(error);
    }
  }, [page]);

  return (
    <div>
      <Heading title="Quyền hệ thống" desc="Quản lý tất cả quyền hệ thống">
        <>
          {show && (
            <Modal handleClose={() => setShow(false)}>
              <AddModal handleClose={() => setShow(false)}></AddModal>
            </Modal>
          )}
          <Button type="button" onClick={() => setShow(true)}>
            Thêm quyền
          </Button>
        </>
      </Heading>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Tên quyền</th>
            <th>Xem</th>
            <th>Thêm</th>
            <th>Xóa</th>
            <th>Sửa</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {roles?.length > 0 &&
            roles.map((role) => (
              <tr key={role._id}>
                <td>{role._id}</td>
                <td>{role.name}</td>
                <td>
                  <Checked checked={role.read}></Checked>
                </td>
                <td>
                  <Checked checked={role.add}></Checked>
                </td>
                <td>
                  <Checked checked={role.delete}></Checked>
                </td>
                <td>
                  <Checked checked={role.edit}></Checked>
                </td>
                <td>
                  <UpdateAction item={role}></UpdateAction>
                </td>
              </tr>
            ))}
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

export default RolesPage;
