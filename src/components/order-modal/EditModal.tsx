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
};

const EditModal: React.FC<IEditModalProps> = ({ handleClose, item }) => {
  const [methodPlaceholder, setMethodPlaceholder] = useState(
    'Chọn phương thức thanh toán'
  );
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
    },
    resolver: yupResolver(OrderSchema),
  });

  const status = useWatch({ control, name: 'status' });
  const watchingMethod = useWatch({ control, name: 'method' });

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

  const handleEditOrder: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload: any = await orderApi.updateOrder(item._id, data);
      console.log(
        '🚀 ~ file: EditModal.tsx:84 ~ consthandleEditOrder:SubmitHandler<FormValues>= ~ order',
        payload
      );
      toast.success('Cập nhật thành công!');
      // handleClose && handleClose();
    } catch (error) {
      toast.error('Cập nhật thất bại!');
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleEditOrder)} className="">
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col justify-between w-full gap-5 mx-auto">
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
        </div>
        <div className="flex flex-col justify-between w-full gap-5 mx-auto">
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
      <Field className="items-center !mb-0 col-span-full">
        <Button loading={isSubmitting} type="submit" className="mb-0">
          Lưu
        </Button>
      </Field>
    </form>
  );
};

export default EditModal;
