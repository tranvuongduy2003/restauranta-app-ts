import categoryApi from 'api/categoryApi';
import DeleteAction from 'components/actions/DeleteAction';
import UpdateAction from 'components/category-modal/actions/UpdateAction';
import ViewAction from 'components/actions/ViewAction';
import Search from 'components/Search';
import Table from 'components/Table';
import Heading from 'pages/Dashboard/Heading';
import React, { useEffect, useState } from 'react';
import Pagination from 'components/Pagination';
import CategorySkeleton from 'components/skeleton/CategorySkeleton';
import { ICategory } from 'utils/interface';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ViewModal from 'components/category-modal/ViewModal';
import Modal from 'components/modal/Modal';
import AddModal from 'components/category-modal/AddModal';
import Button from 'components/Button';

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const handleFetchData = async () => {
        setLoading(true);
        const data: any = await categoryApi.getAll(1);
        const { categories, totalItems } = data;
        setCategories(categories);
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
        const data: any = await categoryApi.getAll(page, search);
        const { categories } = data;
        setCategories(categories);
        setLoading(false);
      };
      handleFetchData();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [page, search]);

  const handleDeleteItem = async (id: string) => {
    try {
      if (id) {
        await categoryApi.remove(id);
      } else {
        throw new Error('id not found');
      }
      toast.success('Xóa danh mục thành công!');
      navigate(0);
    } catch (error) {
      toast.error('Xóa danh mục thất bại!');
      console.log(error);
    }
  };

  return (
    <div>
      <Heading title="Loại món" desc="Quản lý tất cả loại món ăn">
        <>
          {show && (
            <Modal handleClose={() => setShow(false)}>
              <AddModal handleClose={() => setShow(false)}></AddModal>
            </Modal>
          )}
          <Button type="button" onClick={() => setShow(true)}>
            Thêm loại món
          </Button>
        </>
      </Heading>
      <div className="flex items-center justify-start gap-5 mb-10">
        <div className="w-full max-w-[400px]">
          <Search
            handleInputChange={setSearch}
            name="search"
            placeholder="Tìm kiếm loại món ăn..."
          ></Search>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Tên</th>
            <th>Ngày tạo</th>
            <th>Số sản phẩm</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {!loading ? (
            categories?.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category._id}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                </td>
                <td>
                  <time>
                    {category.createdAt &&
                      new Date(category.createdAt).toLocaleDateString('vi-VN')}
                  </time>
                </td>
                <td>{category.foods && category.foods.length}</td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ViewAction>
                      <ViewModal item={category}></ViewModal>
                    </ViewAction>
                    <UpdateAction item={category}></UpdateAction>
                    <DeleteAction
                      onClick={() => handleDeleteItem(category._id || '')}
                    ></DeleteAction>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <>
              <CategorySkeleton></CategorySkeleton>
              <CategorySkeleton></CategorySkeleton>
              <CategorySkeleton></CategorySkeleton>
              <CategorySkeleton></CategorySkeleton>
              <CategorySkeleton></CategorySkeleton>
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

export default CategoryPage;
