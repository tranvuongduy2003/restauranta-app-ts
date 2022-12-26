import Button from 'components/Button';
import ErrorMessage from 'components/ErrorMessage';
import Field from 'components/Field';
import Input from 'components/Input';
import Label from 'components/Label';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
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

const categorySchema = yup.object({
  name: yup.string().required('Tên danh mục không được để trống'),
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
  role: string;
  address: string;
};

const EditModal: React.FC<IEditModalProps> = ({ handleClose, item }) => {
  const [file, setFile] = useState<File>();
  const [deletedImage, setDeletedImage] = useState<string>();
  const fileRef = useRef<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>(item.role);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      avatar: item.avatar,
      name: item.name,
      email: item.email,
      phoneNumber: item.phoneNumber,
      role: item.role,
      address: item.address,
    },
    resolver: yupResolver(categorySchema),
  });

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
          await userApi.editUser(item._id, {
            name: data.name,
            email: data.email,
            address: data.address,
            phoneNumber: data.phoneNumber,
            role: data.role,
            avatar: {
              url: downloadURL,
              ref: uploadTask.snapshot.metadata.fullPath,
            },
          });
          fileRef.current.value = null;
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
    <form onSubmit={handleSubmit(handleEditUser)} className="">
      <div className="mx-auto mb-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative">
            <img
              src={`${
                file
                  ? URL.createObjectURL(file)
                  : 'https://tinhayvip.com/wp-content/uploads/2022/04/meme-ech-xanh-5.jpg'
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
              <ErrorMessage>{errors.email.message as string}</ErrorMessage>
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
              <ErrorMessage>{errors.email.message as string}</ErrorMessage>
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
            <Label name="role">Phân quyền</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={`${
                  selectedRole !== '' ? selectedRole : 'Chọn quyền'
                }`}
              ></Dropdown.Select>
              <Dropdown.List>
                <Dropdown.Option onClick={() => setSelectedRole('user')}>
                  user
                </Dropdown.Option>
                <Dropdown.Option onClick={() => setSelectedRole('admin')}>
                  admin
                </Dropdown.Option>
              </Dropdown.List>
            </Dropdown>
            {errors.role && <ErrorMessage>{errors.role.message}</ErrorMessage>}
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
