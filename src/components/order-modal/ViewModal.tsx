import Field from 'components/Field';
import Label from 'components/Label';
import Action from 'components/status/Action';
import Status from 'components/status/Status';
import Table from 'components/Table';
import { method } from 'constants/method';
import React, { useEffect, useState } from 'react';
import { ICartItem, IOrder } from 'utils/interface';

interface IViewModalProps {
  item: IOrder;
}

const ViewModal: React.FC<IViewModalProps> = ({ item }) => {
  const [methodPlaceholder, setMethodPlaceholder] = useState('');

  useEffect(() => {
    switch (item.method) {
      case method.DIRECT.id:
        setMethodPlaceholder(method.DIRECT.title);
        break;
      case method.BANKING.id:
        setMethodPlaceholder(method.BANKING.title);
        break;
      case method.MOMO.id:
        setMethodPlaceholder(method.MOMO.title);
        break;

      default:
        break;
    }
  }, [item.method]);

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
          <Field>
            <Label>Địa chỉ</Label>
            <div>{item.address}</div>
          </Field>
        </div>
        <div className="flex flex-col justify-start w-full gap-5 mx-auto">
          <Field>
            <Label>Phương thức</Label>
            <div>{methodPlaceholder}</div>
          </Field>
          <Field>
            <Label>Tình trạng</Label>
            <div className="my-2">
              <div>
                <Action actionProps={item.action}></Action>
              </div>
            </div>
          </Field>
          <Field>
            <Label>Trạng thái</Label>
            <div className="my-2">
              <Status statusProps={item.status}></Status>
            </div>
          </Field>
          <Field>
            <Label>Tổng tiền</Label>
            <div>{item.totalPrice?.toString()}</div>
          </Field>
          <Field>
            <Label>Ghi chú</Label>
            <div className="my-2">
              <div>{item.desc}</div>
            </div>
          </Field>
        </div>
      </div>
      <div>
        <div className="mx-auto my-5 text-lg font-medium text-center">
          Danh sách món
        </div>
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Tên món</th>
              <th>Giá</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {item?.items?.length > 0 &&
              item.items.map((item: ICartItem) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.qty}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ViewModal;
