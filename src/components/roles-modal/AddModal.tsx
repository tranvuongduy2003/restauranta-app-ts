import Button from 'components/Button';
import ErrorMessage from 'components/ErrorMessage';
import Field from 'components/Field';
import Input from 'components/Input';
import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import Table from 'components/Table';
import Checkbox from 'components/Checkbox';
import { IRole } from 'utils/interface';
import roleApi from 'api/roleApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const roleSchema = yup.object({
  name: yup.string().required('Tên quyền không được để trống'),
});

interface IAddModalProps {
  handleClose: () => void;
}

type FormValues = {
  name: string;
  read: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
};

const AddModal: React.FC<IAddModalProps> = ({ handleClose }) => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      read: false,
      add: false,
      edit: false,
      delete: false,
    },
    resolver: yupResolver(roleSchema),
  });

  const watchRead = watch('read');
  const watchAdd = watch('add');
  const watchEdit = watch('edit');
  const watchDelete = watch('delete');

  const handleAddRoles: SubmitHandler<FormValues> = async (data) => {
    try {
      await roleApi.create(data);
      toast.success('Tạo quyền thành công!');
      navigate(0);
      handleClose && handleClose();
    } catch (error) {
      toast.error('Cập nhật thất bại!');
      console.log(
        '🚀 ~ file: AddModal.tsx:43 ~ consthandleAddRoles:SubmitHandler<FormValues>= ~ error',
        error
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAddRoles)} className="">
      <div className="flex flex-col justify-start w-full gap-5 mx-auto">
        <Table>
          <thead>
            <tr>
              <th>Tên quyền</th>
              <th>Xem</th>
              <th>Thêm</th>
              <th>Xóa</th>
              <th>Sửa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Input
                  control={control as any}
                  name="name"
                  placeholder="Nhập tên quyền"
                ></Input>
              </td>
              <td>
                <Checkbox
                  checked={watchRead}
                  onClick={() => setValue('read', !watchRead)}
                ></Checkbox>
              </td>
              <td>
                <Checkbox
                  checked={watchAdd}
                  onClick={() => setValue('add', !watchAdd)}
                ></Checkbox>
              </td>
              <td>
                <Checkbox
                  checked={watchDelete}
                  onClick={() => setValue('delete', !watchDelete)}
                ></Checkbox>
              </td>
              <td>
                <Checkbox
                  checked={watchEdit}
                  onClick={() => setValue('edit', !watchEdit)}
                ></Checkbox>
              </td>
            </tr>
          </tbody>
        </Table>
        {errors.name && (
          <ErrorMessage>{errors.name.message as string}</ErrorMessage>
        )}
      </div>
      <Field className="items-center !mb-0 col-span-full">
        <Button loading={isSubmitting} type="submit" className="mb-0">
          Tạo mới
        </Button>
      </Field>
    </form>
  );
};

export default AddModal;
