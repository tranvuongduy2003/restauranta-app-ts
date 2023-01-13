import Field from 'components/Field';
import Label from 'components/Label';
import React from 'react';
import { IUser } from 'utils/interface';

interface IViewModalProps {
  item: IUser;
}

const ViewModal: React.FC<IViewModalProps> = ({ item }) => {
  return (
    <div className="">
      <div className="mx-auto mb-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative">
            <img
              src={`${
                item?.avatar?.url
                  ? item?.avatar?.url
                  : 'https://tinhayvip.com/wp-content/uploads/2022/04/meme-ech-xanh-5.jpg'
              }`}
              alt=""
              className="object-cover w-32 h-32 rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col justify-start w-full gap-5 mx-auto">
          <Field>
            <Label name="name">Tên người dùng</Label>
            <div>{item.name}</div>
          </Field>
          <Field>
            <Label name="email">Email</Label>
            <div>{item.email}</div>
          </Field>
          <Field>
            <Label name="address">Địa chỉ</Label>
            {item?.address || ''}
          </Field>
        </div>
        <div className="flex flex-col justify-start w-full gap-5 mx-auto">
          <Field>
            <Label name="phoneNumber">Số điện thoại</Label>
            <div>{item.phoneNumber}</div>
          </Field>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
