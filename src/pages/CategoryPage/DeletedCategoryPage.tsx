import categoryApi from 'api/categoryApi';
import DeleteAction from 'components/actions/DeleteAction';
import ViewAction from 'components/actions/ViewAction';
import Search from 'components/Search';
import Table from 'components/Table';
import Heading from 'pages/Dashboard/Heading';
import React, { useEffect, useState } from 'react';
import Pagination from 'components/Pagination';
import CategorySkeleton from 'components/skeleton/CategorySkeleton';
import { ICategory } from 'utils/interface';
import ViewModal from 'components/category-modal/ViewModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RecoverAction from 'components/actions/RecoverAction';

const DeletedCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const handleFetchData = async () => {
        setLoading(true);
        const { categories, totalItems }: any = await categoryApi.getDeleted(1);
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
        const data: any = await categoryApi.getDeleted(page, search);
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
        await categoryApi.removeFromDeleted(id);
      } else {
        throw new Error('id not found');
      }
      toast.success('X??a danh m???c th??nh c??ng!');
      navigate(0);
    } catch (error) {
      toast.error('X??a danh m???c th???t b???i!');
      console.log(error);
    }
  };

  const handleRecoverCategory = async (id: string) => {
    try {
      await categoryApi.recover(id);
      toast.success('Kh??i ph???c danh m???c th??nh c??ng!');
      navigate(0);
    } catch (error) {
      toast.error('Kh??i ph???c danh m???c th???t b???i!');
      console.log(error);
    }
  };

  return (
    <div>
      <Heading
        title="Lo???i m??n"
        desc="Qu???n l?? t???t c??? lo???i m??n ???? x??a"
        backUrl="/category"
        backTitle="Tr??? v???"
      ></Heading>
      <div className="flex items-center justify-start gap-5 mb-10">
        <div className="w-full max-w-[400px]">
          <Search
            handleInputChange={setSearch}
            name="search"
            placeholder="T??m ki???m lo???i m??n ??n..."
          ></Search>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>T??n</th>
            <th>Ng??y t???o</th>
            <th>S??? s???n ph???m</th>
            <th>Thao t??c</th>
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
                    <RecoverAction
                      onClick={() => handleRecoverCategory(category._id || '')}
                    ></RecoverAction>
                    <ViewAction>
                      <ViewModal item={category}></ViewModal>
                    </ViewAction>
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

export default DeletedCategoryPage;
