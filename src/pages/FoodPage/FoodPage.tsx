import categoryApi from 'api/categoryApi';
import foodApi from 'api/foodApi';
import DeleteAction from 'components/actions/DeleteAction';
import UpdateAction from 'components/food-modal/actions/UpdateAction';
import ViewAction from 'components/actions/ViewAction';
import { Dropdown } from 'components/dropdown';
import Search from 'components/Search';
import Table from 'components/Table';
import React, { useEffect, useState } from 'react';
import Heading from '../Dashboard/Heading';
import Pagination from 'components/Pagination';
import FoodSkeleton from 'components/skeleton/FoodSkeleton';
import { ICategory, IFood } from 'utils/interface';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ViewModal from 'components/food-modal/ViewModal';

const FoodPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectCategory, setSelectCategory] = useState<ICategory>();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState<string>('');
  const [foods, setFoods] = useState<IFood[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const handleFetchData = async () => {
        setLoading(true);
        const categoriesData: any = await categoryApi.getAll();
        const { categories } = categoriesData;
        const foodsData: any = await foodApi.getAll(1);
        const { foods, totalItems } = foodsData;
        setCategories(categories);
        setFoods(foods);
        setTotalItems(totalItems);
        setLoading(false);
      };
      handleFetchData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(search);
    try {
      const handleFetchData = async () => {
        setLoading(true);
        const foodsData: any = await foodApi.getAll(
          page || 1,
          selectCategory?._id,
          search
        );
        const { foods, totalItems } = foodsData;
        setFoods(foods);
        setTotalItems(totalItems);
        setLoading(false);
      };
      handleFetchData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [page, selectCategory, search]);

  const handleDeleteItem = async (id: string) => {
    try {
      if (id) {
        await foodApi.remove(id);
      } else {
        throw new Error('id not found');
      }
      toast.success('X??a m??n ???n th??nh c??ng!');
      navigate(0);
    } catch (error) {
      toast.error('X??a m??n ??n th???t b???i!');
      console.log(error);
    }
  };

  return (
    <div>
      <Heading
        title="M??n ??n"
        desc="Qu???n l?? t???t c??? m??n ??n"
        addUrl="/"
        addTitle="Th??m m??n ??n"
        deleteUrl="/food/deleted"
        deleteTitle="M??n ??n ???? x??a"
      ></Heading>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center flex-1 gap-5">
          <div className="w-full max-w-[400px]">
            <Search
              handleInputChange={setSearch}
              name="search"
              placeholder="T??m ki???m m??n ??n..."
            ></Search>
          </div>
        </div>
        <div className="w-full max-w-[220px]">
          <Dropdown>
            <Dropdown.Select
              placeholder={`${
                selectCategory ? selectCategory.name : 'Ch???n danh m???c'
              }`}
            ></Dropdown.Select>
            <Dropdown.List>
              {categories?.map((item) => (
                <Dropdown.Option
                  key={item._id}
                  onClick={() => {
                    setSelectCategory(item);
                    setPage(1);
                  }}
                >
                  {item.name}
                </Dropdown.Option>
              ))}
            </Dropdown.List>
          </Dropdown>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>T??n m??n ??n</th>
            <th>Danh m???c</th>
            <th>Gi??</th>
            <th>Thao t??c</th>
          </tr>
        </thead>
        <tbody>
          {!loading ? (
            foods?.length > 0 &&
            foods.map((food) => (
              <tr key={food._id}>
                <td>{food._id}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={food.posterImage?.url || ''}
                      alt={food.name}
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{food.name}</h3>
                      <time className="text-sm text-gray-500">
                        Ng??y t???o:{' '}
                        {food.createdAt &&
                          new Date(food.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-gray-500">
                    {
                      categories?.find(
                        (category) => category._id === food.categoryId
                      )?.name
                    }
                  </span>
                </td>
                <td>
                  <span className="text-gray-500">
                    {food.price &&
                      Intl.NumberFormat('vn-VN').format(food.price)}
                  </span>
                </td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ViewAction>
                      <ViewModal
                        item={{
                          ...food,
                          categoryName: categories.find(
                            (category) => category._id === food.categoryId
                          )?.name,
                        }}
                      ></ViewModal>
                    </ViewAction>
                    <UpdateAction item={food}></UpdateAction>
                    <DeleteAction
                      onClick={() => handleDeleteItem(food._id || '')}
                    ></DeleteAction>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <>
              <FoodSkeleton></FoodSkeleton>
              <FoodSkeleton></FoodSkeleton>
              <FoodSkeleton></FoodSkeleton>
              <FoodSkeleton></FoodSkeleton>
              <FoodSkeleton></FoodSkeleton>
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

export default FoodPage;
