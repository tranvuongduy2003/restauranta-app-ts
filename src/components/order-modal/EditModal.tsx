import Button from 'components/Button';
import ErrorMessage from 'components/ErrorMessage';
import Field from 'components/Field';
import Input from 'components/Input';
import Label from 'components/Label';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { Dropdown } from 'components/dropdown';
import Status from 'components/status/Status';
import orderApi from 'api/orderApi';
import TextArea from 'components/TextArea';
import { method } from 'constants/method';
import { action } from 'constants/action';
import Table from 'components/Table';
import { ICartItem } from 'utils/interface';
import DeleteAction from 'components/actions/DeleteAction';

const OrderSchema = yup.object({
  name: yup.string().required('Tên người đặt không được để trống'),
  phoneNumber: yup.string().required('Số điện thoại không được để trống'),
  address: yup.string().required('Địa chỉ không được để trống'),
});

interface IEditModalProps {
  handleClose: () => void;
  item: any;
}

type FormValues = {
  userId: string;
  name: string;
  phoneNumber: string;
  method: string;
  address: number;
  status: string;
  desc?: string;
  action?: string;
};

const EditModal: React.FC<IEditModalProps> = ({ handleClose, item }) => {
  const [methodPlaceholder, setMethodPlaceholder] = useState(
    'Chọn phương thức thanh toán'
  );
  const [actionPlaceholder, setActionPlaceholder] = useState(
    'Chọn tình trạng đơn hàng'
  );

  const [deletedItems, setDeletedItems] = useState<ICartItem[]>(item.items);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      userId: item.userId,
      name: item.name,
      phoneNumber: item.phoneNumber,
      method: item.method,
      address: item.address,
      status: item.status,
      desc: item.desc,
      action: item.action,
    },
    resolver: yupResolver(OrderSchema),
  });

  const status = useWatch({ control, name: 'status' });
  const watchingMethod = useWatch({ control, name: 'method' });
  const watchingAction = useWatch({ control, name: 'action' });

  useEffect(() => {
    switch (watchingMethod) {
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
  }, [watchingMethod]);

  useEffect(() => {
    switch (watchingAction) {
      case action.CANCLE.id:
        setActionPlaceholder(action.CANCLE.title);
        break;
      case action.HANDLING.id:
        setActionPlaceholder(action.HANDLING.title);
        break;
      case action.PREPARING.id:
        setActionPlaceholder(action.PREPARING.title);
        break;
      case action.DELIVERING.id:
        setActionPlaceholder(action.DELIVERING.title);
        break;
      case action.PAID.id:
        setActionPlaceholder(action.PAID.title);
        break;

      default:
        break;
    }
  }, [watchingAction]);

  const handleEditOrder: SubmitHandler<FormValues> = async (data) => {
    try {
      await orderApi.updateOrder(item._id, { ...data, items: deletedItems });
      toast.success('Cập nhật thành công!');
      handleClose && handleClose();
    } catch (error) {
      toast.error('Cập nhật thất bại!');
      console.log(error);
    }
  };

  const handleDeleteItemFromOrder = (itemId: string) => {
    const newDeletedItems = deletedItems.filter((item) => item.id !== itemId);
    setDeletedItems(newDeletedItems);
  };

  return (
    <form onSubmit={handleSubmit(handleEditOrder)} className="">
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col justify-start w-full gap-5 mx-auto">
          <Field>
            <Label name="name">Tên người đặt</Label>
            <Input
              control={control as any}
              name="name"
              placeholder="Nhập tên người đật"
            ></Input>
            {errors.name && (
              <ErrorMessage>{errors.name.message as string}</ErrorMessage>
            )}
          </Field>
          <Field>
            <Label name="phoneNumber">Số điện thoại</Label>
            <Input
              control={control as any}
              name="phoneNumber"
              placeholder="Nhập số điện thoại người đặt"
            ></Input>
            {errors.phoneNumber && (
              <ErrorMessage>
                {errors.phoneNumber.message as string}
              </ErrorMessage>
            )}
          </Field>
          <Field>
            <Label name="address">Địa chỉ</Label>
            <Input
              control={control as any}
              name="address"
              placeholder="Nhập địa chỉ giao hàng"
            ></Input>
            {errors.address && (
              <ErrorMessage>{errors.address.message as string}</ErrorMessage>
            )}
          </Field>
          <Field>
            <Label name="status">Trạng thái</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={status.charAt(0).toUpperCase() + status.slice(1)}
              ></Dropdown.Select>
              <Dropdown.List>
                <Dropdown.Option onClick={() => setValue('status', 'accepted')}>
                  Accepted
                </Dropdown.Option>
                <Dropdown.Option onClick={() => setValue('status', 'pending')}>
                  Pending
                </Dropdown.Option>
                <Dropdown.Option onClick={() => setValue('status', 'rejected')}>
                  Rejected
                </Dropdown.Option>
              </Dropdown.List>
            </Dropdown>
            <Status statusProps={status}></Status>
            {errors.status && (
              <ErrorMessage>{errors.status.message}</ErrorMessage>
            )}
          </Field>
        </div>
        <div className="flex flex-col justify-start w-full gap-5 mx-auto">
          <Field>
            <Label name="method">Phương thức</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={methodPlaceholder}
              ></Dropdown.Select>
              <Dropdown.List>
                <Dropdown.Option
                  onClick={() => {
                    setValue('method', method.DIRECT.id);
                    setMethodPlaceholder('Thanh toán trực tiếp');
                  }}
                >
                  Thanh toán trực tiếp
                </Dropdown.Option>
              </Dropdown.List>
            </Dropdown>
            {errors.method && (
              <ErrorMessage>{errors.method.message as string}</ErrorMessage>
            )}
          </Field>
          <Field>
            <Label name="action">Tình trạng</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={actionPlaceholder}
              ></Dropdown.Select>
              <Dropdown.List>
                <Dropdown.Option
                  onClick={() => setValue('action', action.CANCLE.id)}
                >
                  {action.CANCLE.title}
                </Dropdown.Option>
                <Dropdown.Option
                  onClick={() => setValue('action', action.HANDLING.id)}
                >
                  {action.HANDLING.title}
                </Dropdown.Option>
                <Dropdown.Option
                  onClick={() => setValue('action', action.PREPARING.id)}
                >
                  {action.PREPARING.title}
                </Dropdown.Option>
                <Dropdown.Option
                  onClick={() => setValue('action', action.DELIVERING.id)}
                >
                  {action.DELIVERING.title}
                </Dropdown.Option>
                <Dropdown.Option
                  onClick={() => setValue('action', action.PAID.id)}
                >
                  {action.PAID.title}
                </Dropdown.Option>
              </Dropdown.List>
            </Dropdown>
            {errors.status && (
              <ErrorMessage>{errors.status.message}</ErrorMessage>
            )}
          </Field>
          <Field>
            <Label name="desc">Ghi chú</Label>
            <TextArea
              control={control as any}
              name="desc"
              height="300px"
              placeholder="Nhập ghi chú"
            ></TextArea>
            {errors.desc && (
              <ErrorMessage>{errors.desc.message as string}</ErrorMessage>
            )}
          </Field>
        </div>
      </div>
      <div className="mb-10">
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deletedItems?.length > 0 &&
              deletedItems.map((item: ICartItem) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.qty}</td>
                  <td>
                    <DeleteAction
                      onClick={() => handleDeleteItemFromOrder(item.id || '')}
                    ></DeleteAction>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <Field className="items-center !mb-0 col-span-full">
        <Button loading={isSubmitting} type="submit" className="mb-0">
          Lưu
        </Button>
      </Field>
    </form>
  );
};

export default EditModal;
