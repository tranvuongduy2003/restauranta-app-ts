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

const roleSchema = yup.object({
  name: yup.string().required('Tên quyền không được để trống'),
});

interface IEditModalProps {
  handleClose: () => void;
  item: IRole;
}

type FormValues = {
  name: string;
  read: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
};

const EditModal: React.FC<IEditModalProps> = ({ handleClose, item }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: item.name,
      read: item.read,
      add: item.add,
      edit: item.edit,
      delete: item.delete,
    },
    resolver: yupResolver(roleSchema),
  });

  const watchRead = watch('read');
  const watchAdd = watch('add');
  const watchEdit = watch('edit');
  const watchDelete = watch('delete');

  const handleUpdateRoles: SubmitHandler<FormValues> = async (data) => {
    try {
      await roleApi.update(item._id, data);
      toast.success('Cập nhật thành công!');
      handleClose && handleClose();
    } catch (error) {
      toast.error('Cập nhật thất bại!');
      console.log(
        '🚀 ~ file: EditModal.tsx:43 ~ consthandleUpdateRoles:SubmitHandler<FormValues>= ~ error',
        error
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleUpdateRoles)} className="">
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
                  defaultValue={item.name}
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
          Lưu
        </Button>
      </Field>
    </form>
  );
};

export default EditModal;
