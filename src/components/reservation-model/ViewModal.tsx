import Field from 'components/Field';
import Label from 'components/Label';
import Status from 'components/status/Status';
import React from 'react';
import { IReservation } from 'utils/interface';

interface IViewModalProps {
  item: IReservation;
}

const ViewModal: React.FC<IViewModalProps> = ({ item }) => {
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col justify-start w-full gap-5 mx-auto">
          <Field>
            <Label>ID</Label>
            <div>{item._id}</div>
          </Field>
          <Field>
            <Label>User ID</Label>
            <div>{item.userId}</div>
          </Field>
          <Field>
            <Label>Tên người đặt</Label>
            <div>{item.name}</div>
          </Field>
          <Field>
            <Label>Số điện thoại</Label>
            <div>{item.phoneNumber}</div>
          </Field>
        </div>
        <div className="flex flex-col justify-start w-full gap-5 mx-auto">
          <Field>
            <Label>Ngày đặt</Label>
            {item.bookingDate}
          </Field>
          <Field>
            <Label>Giờ đặt</Label>
            {item.bookingTime}
          </Field>
          <Field>
            <Label>Số lượng người</Label>
            <div>{item.quantity}</div>
          </Field>
          <Field>
            <Label>Trạng thái</Label>
            <div className="my-2">
              <Status statusProps={item.status}></Status>
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
