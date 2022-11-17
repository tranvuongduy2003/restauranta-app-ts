import categoryApi from 'api/categoryApi';
import DeleteAction from 'components/category-modal/actions/DeleteAction';
import UpdateAction from 'components/category-modal/actions/UpdateAction';
import ViewAction from 'components/category-modal/actions/ViewAction';
import Button from 'components/Button';
import Search from 'components/Search';
import Table from 'components/Table';
import Heading from 'pages/Dashboard/Heading';
import React, { useEffect, useState } from 'react';
import Pagination from 'components/Pagination';
import CategorySkeleton from 'components/skeleton/CategorySkeleton';
import { ICategory } from 'utils/interface';

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <div>
      <Heading title="Danh mục" desc="Quản lý tất cả danh mục"></Heading>
      <div className="flex items-center justify-start gap-5 mb-10">
        <div className="w-full max-w-[300px]">
          <Search
            handleInputChange={setSearch}
            name="search"
            placeholder="Tìm kiếm danh mục..."
          ></Search>
        </div>
        <Button to="/category/add-new" type="button">
          Thêm danh mục
        </Button>
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
                      new Date(category.createdAt).toLocaleDateString()}
                  </time>
                </td>
                <td>{category.foods && category.foods.length}</td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ViewAction item={category}></ViewAction>
                    <UpdateAction item={category}></UpdateAction>
                    <DeleteAction id={category._id}></DeleteAction>
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
        lastPage={Math.ceil(totalItems / 5)}
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
