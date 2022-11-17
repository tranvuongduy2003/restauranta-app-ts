import React, { useState } from 'react';
import { IFood, Image } from 'utils/interface';

type ViewModalProps = {
  item: IFood & {
    categoryName?: string;
  };
};

const ViewModal: React.FC<ViewModalProps> = ({ item }) => {
  const [poster, setPoster] = useState<string>(item.posterImage?.url || '');

  const handleSelectImage = (image: Image) => {
    setPoster(image.url || '');
  };

  return (
    <div className="grid grid-cols-2 gap-x-10">
      <div className="flex flex-col justify-start gap-6">
        <div className="flex flex-col items-start gap-y-[10px]">
          <h3 className="font-medium cursor-pointer">Tên món ăn</h3>
          <p>{item.name}</p>
        </div>
        <div className="flex flex-col items-start gap-y-[10px]">
          <h3 className="font-medium cursor-pointer">Giá</h3>
          <p>{Intl.NumberFormat('vn-VN').format(item.price || 0)}</p>
        </div>
        <div className="flex flex-col items-start gap-y-[10px]">
          <h3 className="font-medium cursor-pointer">Danh mục</h3>
          <p>{item.categoryName}</p>
        </div>
        <div className="flex flex-col items-start gap-y-[10px]">
          <h3 className="font-medium cursor-pointer">Mô tả</h3>
          <p>{item.description}</p>
        </div>
        <div className="flex flex-col items-start gap-y-[10px]">
          <h3 className="font-medium cursor-pointer">Tags</h3>
          <div className="flex items-center gap-x-2">
            {item.bestDeals && (
              <div className="p-2 font-medium bg-green-100 rounded-md text-primary">
                Best Deals
              </div>
            )}
            {item.popular && (
              <div className="p-2 font-medium bg-green-100 rounded-md text-primary">
                Phổ biến
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-2">
          <img
            src={poster}
            alt=""
            className="object-cover w-full h-[350px] rounded-sm"
          />
        </div>
        <div className="flex gap-x-2">
          {item.images &&
            item.images.length > 0 &&
            item.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt=""
                className={`object-cover w-[81.6px] h-[81.6px] rounded-sm cursor-pointer ${
                  image.url === poster ? 'opacity-100' : 'opacity-70'
                }`}
                onClick={() => handleSelectImage(image)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
