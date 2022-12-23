import foodApi from 'api/foodApi';
import React, { useEffect, useState } from 'react';
import { ICategory, IFood } from 'utils/interface';

interface IViewModalProps {
  item: ICategory;
}

const ViewModal: React.FC<IViewModalProps> = ({ item }) => {
  const [foods, setFoods] = useState<IFood[]>([]);

  useEffect(() => {
    const handleFetchFoods = async () => {
      try {
        const data: any = await foodApi.getAll();
        const foods = { ...data.foods };
        setFoods(foods.filter((food: IFood) => food.categoryId === item._id));
      } catch (error) {
        console.log(error);
      }
    };
    handleFetchFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-2 gap-x-10">
      <div className="flex flex-col justify-start gap-6">
        <div className="flex flex-col items-start gap-y-[10px]">
          <h3 className="font-medium cursor-pointer">Tên món ăn</h3>
          <p>{item.name}</p>
        </div>
        <div className="flex flex-col items-start gap-y-[10px]">
          <h3 className="font-medium cursor-pointer">Số lượng món</h3>
          <p>{item.foods?.length}</p>
        </div>
        <div className="flex flex-col items-start gap-y-[10px]">
          <h3 className="font-medium cursor-pointer">Món ăn</h3>
          {foods.length > 0 && foods.map((food) => <p>{food.name}</p>)}
        </div>
      </div>
      <div className="mb-2">
        <img
          src={item.image}
          alt=""
          className="object-cover w-full h-[350px] rounded-sm"
        />
      </div>
    </div>
  );
};

export default ViewModal;
