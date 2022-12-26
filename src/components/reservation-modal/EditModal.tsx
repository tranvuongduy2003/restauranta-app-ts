import Button from 'components/Button';
import ErrorMessage from 'components/ErrorMessage';
import Field from 'components/Field';
import Input from 'components/Input';
import Label from 'components/Label';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { Dropdown } from 'components/dropdown';
import Status from 'components/status/Status';
import reservationApi from 'api/reservationApi';
import DatePicker from 'react-date-picker';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const reservationSchema = yup.object({
  name: yup.string().required('Tên danh mục không được để trống'),
  phoneNumber: yup.string().required('Số điện thoại không được để trống'),
  quantity: yup
    .number()
    .integer('Giá trị không hợp lệ')
    .required('Số lượng người không được để trống'),
});

interface IEditModalProps {
  handleClose: () => void;
  item: any;
}

type FormValues = {
  name: string;
  phoneNumber: string;
  bookingDate: string;
  bookingTime: string;
  quantity: number;
  status: string;
};

const EditModal: React.FC<IEditModalProps> = ({ handleClose, item }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState<moment.Moment>();
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: item.name,
      phoneNumber: item.phoneNumber,
      bookingDate: item.bookingDate,
      bookingTime: item.bookingTime,
      quantity: item.quantity,
      status: item.status,
    },
    resolver: yupResolver(reservationSchema),
  });

  const status = useWatch({ control, name: 'status' });

  const handleEditReservation: SubmitHandler<FormValues> = async (data) => {
    try {
      await reservationApi.updateReservation(item._id, data);
      toast.success('Cập nhật thành công!');
      handleClose && handleClose();
    } catch (error) {
      toast.error('Cập nhật thất bại!');
      console.log(error);
    }
  };

  const handleChangeDate = (selectedDate: Date) => {
    console.log(selectedDate);
    setValue('bookingDate', selectedDate.toLocaleDateString('vi-VN'));
    setDate(selectedDate);
  };

  const handleChangeTime = (selectedTime: moment.Moment) => {
    console.log(selectedTime);
    setValue('bookingTime', selectedTime.format('h:mm A'));
    setTime(selectedTime);
  };

  return (
    <form onSubmit={handleSubmit(handleEditReservation)} className="">
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
            <Label name="quantity">Số lượng người</Label>
            <Input
              control={control as any}
              name="quantity"
              placeholder="Nhập số lượng người"
            ></Input>
            {errors.quantity && (
              <ErrorMessage>{errors.quantity.message as string}</ErrorMessage>
            )}
          </Field>
        </div>
        <div className="flex flex-col justify-start w-full gap-5 mx-auto">
          <Field>
            <Label name="bookingDate">Ngày đặt bàn</Label>
            <Input
              control={control as any}
              name="bookingDate"
              placeholder="Nhập ngày đặt bàn"
              disabled
            ></Input>

            <button
              type="button"
              className="p-[15px_25px] rounded-lg bg-sky-500 relative"
              onClick={() => setOpenDate(true)}
            >
              <span className="font-medium text-white">Chọn ngày</span>
              <DatePicker
                className={'!hidden'}
                portalContainer={
                  document.getElementById('my-date') || undefined
                }
                locale="vi-VN"
                onCalendarClose={() => setOpenDate(false)}
                isOpen={openDate}
                onChange={handleChangeDate}
                value={date}
              />
              <div
                id="my-date"
                className="absolute bottom-0 left-0 z-50 translate-y-full"
              ></div>
            </button>
            {errors.bookingDate && (
              <ErrorMessage>
                {errors.bookingDate.message as string}
              </ErrorMessage>
            )}
          </Field>
          <Field>
            <Label name="bookingTime">Giờ đặt bàn</Label>
            <Input
              control={control as any}
              name="bookingTime"
              placeholder="Nhập số điện thoại người dùng"
              disabled={true}
            ></Input>

            <button
              type="button"
              className="p-[15px_25px] rounded-lg bg-sky-500 relative"
              onClick={() => setOpenTime(true)}
            >
              <span className="font-medium text-white">Chọn giờ</span>
              <div className="absolute bottom-0 left-0 w-0 h-0 translate-y-full">
                <TimePicker
                  showSecond={false}
                  onChange={handleChangeTime}
                  onClose={() => setOpenTime(false)}
                  value={time}
                  open={openTime}
                  className="invisible w-0 h-0"
                  placeholder="bottomRight"
                />
              </div>
            </button>
            {errors.bookingTime && (
              <ErrorMessage>
                {errors.bookingTime.message as string}
              </ErrorMessage>
            )}
          </Field>
          <Field>
            <Label name="role">Trạng thái</Label>
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
