import Button from 'components/Button';
import ErrorMessage from 'components/ErrorMessage';
import Field from 'components/Field';
import Input from 'components/Input';
import Label from 'components/Label';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import {
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from 'firebase-config';
import { Dropdown } from 'components/dropdown';
import userApi from 'api/userApi';
import { IRole } from 'utils/interface';
import roleApi from 'api/roleApi';
import Table from 'components/Table';
import Checked from 'components/Checked';
import Pagination from 'components/Pagination';
import Checkbox from 'components/Checkbox';

const phoneNumberRegex =
  // eslint-disable-next-line no-useless-escape
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

const userSchema = yup.object({
  name: yup.string().required('Tên danh mục không được để trống'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
  phoneNumber: yup
    .string()
    .matches(phoneNumberRegex, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại không được để trống'),
});

interface IEditModalProps {
  handleClose: () => void;
  item: any;
}

type Image = {
  url: string;
  ref: string;
};

type FormValues = {
  name: string;
  avatar: Image;
  email: string;
  phoneNumber: string;
  role: IRole[];
  address: string;
};

type ViewType = 'info' | 'role';

type RoleType = {
  value: IRole;
  checked: boolean;
};

const EditModal: React.FC<IEditModalProps> = ({ handleClose, item }) => {
  const [file, setFile] = useState<File>();
  const [deletedImage, setDeletedImage] = useState<string>();
  const fileRef = useRef<any>(null);
  const [view, setView] = useState<ViewType>('info');
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      avatar: item.avatar,
      name: item.name,
      email: item.email,
      phoneNumber: item.phoneNumber,
      role: [],
      address: item.address,
    },
    resolver: yupResolver(userSchema),
  });

  const roleWatch = watch('role');

  useEffect(() => {
    try {
      const handleFetchData = async () => {
        const data: any = await roleApi.getAll(page);
        const { roles, totalItems } = data;
        const checkedRoles = roles.map((role: IRole) => {
          if (item.role.find((item: IRole) => item._id === role._id)) {
            return { value: role, checked: true };
          } else {
            return { value: role, checked: false };
          }
        });
        setRoles(checkedRoles);
        setTotalItems(totalItems);
      };
      handleFetchData();
    } catch (error) {
      console.error(error);
    }
  }, [item.role, page]);

  const handleSelectRole = (role: any) => {
    if (role.checked) {
      const newRole = roleWatch.filter(
        (item: any) => item._id !== role.value._id
      );
      setValue('role', newRole);
    } else {
      const newRole = [...roleWatch, role.value];
      setValue('role', newRole);
    }
  };

  const handleUploadFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.item(0) as File);
  };

  const handleDeleteImage = () => {
    setDeletedImage(item.avatar.ref);
    setFile(undefined);
  };

  const handleEditUser: SubmitHandler<FormValues> = async (data) => {
    if (deletedImage) deleteObject(ref(storage, deletedImage));
    const storageRef = ref(storage, 'avatars/' + file?.name);
    const uploadTask = uploadBytesResumable(storageRef, file as any);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            console.log('Nothing at all');
        }
      },
      (error) => {
        console.error(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          let avatar = { url: '', ref: '' };
          if (file) {
            avatar.url = downloadURL;
            avatar.ref = uploadTask.snapshot.metadata.fullPath;
          }
          await userApi.editUser(item._id, {
            name: data.name,
            email: data.email,
            address: data.address,
            phoneNumber: data.phoneNumber,
            role: data.role,
            avatar: avatar,
          });
          toast.success('Cập nhật thành công!');
          handleClose && handleClose();
        } catch (error) {
          toast.error('Cập nhật thất bại!');
          console.log(error);
        }
      }
    );
  };

  return (
    <div>
      <div className="flex mb-5 border-b-2 border-grayLight">
        <div
          className={`p-5 rounded-t-lg cursor-pointer ${
            view === 'info' && 'bg-grayLight'
          }`}
          onClick={() => setView('info')}
        >
          Thông tin cá nhân
        </div>
        <div
          className={`p-5 rounded-t-lg cursor-pointer ${
            view === 'role' && 'bg-grayLight'
          }`}
          onClick={() => setView('role')}
        >
          Nhóm quyền
        </div>
      </div>
      <form onSubmit={handleSubmit(handleEditUser)} className="">
        {view === 'info' && (
          <>
            <div className="mx-auto mb-10">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="relative">
                  <img
                    src={`${
                      file
                        ? URL.createObjectURL(file)
                        : item.avatar?.url ||
                          'https://tinhayvip.com/wp-content/uploads/2022/04/meme-ech-xanh-5.jpg'
                    }`}
                    alt=""
                    className="object-cover w-32 h-32 rounded-full"
                  />
                  <div
                    className="absolute top-0 right-0 p-1 text-gray-100 bg-gray-300 rounded-full cursor-pointer"
                    onClick={() => handleDeleteImage()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>

                <Field>
                  <label
                    htmlFor="avatar"
                    className="px-5 py-2 font-semibold rounded-full cursor-pointer bg-primary bg-opacity-10 text-primary hover:bg-opacity-20"
                  >
                    Thay đổi ảnh đại diện
                  </label>
                  <input
                    ref={fileRef}
                    onChange={(e) => handleUploadFiles(e)}
                    type="file"
                    id="avatar"
                    name="avatar"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </Field>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col justify-start w-full gap-5 mx-auto">
                <Field>
                  <Label name="name">Tên người dùng</Label>
                  <Input
                    control={control as any}
                    name="name"
                    placeholder="Nhập tên người dùng"
                  ></Input>
                  {errors.name && (
                    <ErrorMessage>{errors.name.message as string}</ErrorMessage>
                  )}
                </Field>
                <Field>
                  <Label name="email">Email</Label>
                  <Input
                    control={control as any}
                    name="email"
                    placeholder="Nhập email người dùng"
                  ></Input>
                  {errors.email && (
                    <ErrorMessage>
                      {errors.email.message as string}
                    </ErrorMessage>
                  )}
                </Field>
              </div>
              <div className="flex flex-col justify-start w-full gap-5 mx-auto">
                <Field>
                  <Label name="phoneNumber">Số điện thoại</Label>
                  <Input
                    control={control as any}
                    name="phoneNumber"
                    placeholder="Nhập số điện thoại người dùng"
                  ></Input>
                  {errors.phoneNumber && (
                    <ErrorMessage>
                      {errors.phoneNumber.message as string}
                    </ErrorMessage>
                  )}
                </Field>
                <Field>
                  <Label name="email">Địa chỉ</Label>
                  <Input
                    control={control as any}
                    name="address"
                    placeholder="Nhập địa chỉ người dùng"
                  ></Input>
                  {errors.email && (
                    <ErrorMessage>
                      {errors.email.message as string}
                    </ErrorMessage>
                  )}
                </Field>
              </div>
            </div>
          </>
        )}
        {view === 'role' && (
          <div className="mb-5">
            <Table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Tên quyền</th>
                  <th>Xem</th>
                  <th>Thêm</th>
                  <th>Xóa</th>
                  <th>Sửa</th>
                </tr>
              </thead>
              <tbody>
                {roles?.length > 0 &&
                  roles.map((role) => (
                    <tr key={role.value._id}>
                      <td>
                        <Checkbox
                          checked={role.checked}
                          onClick={() => {
                            handleSelectRole(role);
                            role.checked = !role.checked;
                          }}
                        ></Checkbox>
                      </td>
                      <td>{role.value.name}</td>
                      <td>
                        <Checked checked={role.value.read}></Checked>
                      </td>
                      <td>
                        <Checked checked={role.value.add}></Checked>
                      </td>
                      <td>
                        <Checked checked={role.value.delete}></Checked>
                      </td>
                      <td>
                        <Checked checked={role.value.edit}></Checked>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <Pagination
              currentPage={page}
              lastPage={Math.ceil((totalItems === 0 ? 1 : totalItems) / 5)}
              increase={() => {
                page !== Math.ceil(totalItems / 5) && setPage(page + 1);
              }}
              decrease={() => {
                page !== 1 && setPage(page - 1);
              }}
            ></Pagination>
          </div>
        )}
        <Field className="items-center !mb-0 col-span-full">
          <Button loading={isSubmitting} type="submit" className="mb-0">
            Lưu
          </Button>
        </Field>
      </form>
    </div>
  );
};

export default EditModal;
