import Button from 'components/Button';
import Field from 'components/Field';
import Input from 'components/Input';
import Label from 'components/Label';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Heading from '../Dashboard/Heading';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from 'firebase-config';
import categoryApi from 'api/categoryApi';
import Toggle from 'components/Toggle';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from 'components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { ICategory } from 'utils/interface';

const categorySchema = yup.object({
  name: yup.string().required('Tên danh mục không được để trống'),
});

const CategoryAddNew: React.FC = () => {
  const navigate = useNavigate();
  const fileRef = useRef<any>(null);
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      image: '',
      popular: false,
    },
    resolver: yupResolver(categorySchema),
  });

  const watchPopular = watch('popular');

  const handleUploadFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.item(0) || undefined);
  };

  const handleAddNewCategory = (data: ICategory) => {
    setLoading(true);
    console.log(file);
    const storageRef = ref(storage, 'categories/' + file?.name);
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
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(async (downloadURL) => {
            try {
              await categoryApi.add({
                ...data,
                image: downloadURL,
                imageRef: uploadTask.snapshot.metadata.fullPath,
              });
              fileRef.current.value = null;
              reset({
                name: '',
                image: '',
                popular: false,
              });
              setLoading(false);
              toast.success('Tạo danh mục thành công!');
              navigate('/category');
            } catch (error) {
              setLoading(false);
              toast.error('Tạo danh mục thất bại!');
              console.log(error);
            }
          })
          .catch((error) => {
            setLoading(false);
            toast.error('Tạo danh mục thất bại!');
            console.log(error);
          });
      }
    );
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <Heading title="Thêm danh mục" desc="Thêm danh mục mới"></Heading>
        <Button to="/category" color="bg-slate-300" type="button">
          Trở về
        </Button>
      </div>
      <form onSubmit={handleSubmit(handleAddNewCategory)}>
        <div className="flex flex-col justify-start w-1/2 gap-5 mx-auto">
          <Field>
            <Label name="name">Tên danh mục</Label>
            <Input
              control={control as any}
              name="name"
              placeholder="Nhập tên danh mục"
            ></Input>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </Field>
          <Field>
            <Label>Tải ảnh</Label>
            <Controller
              control={control as any}
              name="images"
              render={({ field }) => {
                return (
                  <input
                    {...field}
                    ref={fileRef}
                    onChange={(e) => handleUploadFiles(e)}
                    type="file"
                    name="images"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    accept="image/png, image/jpeg, image/jpg"
                    required
                  ></input>
                );
              }}
            />
          </Field>
          <Field>
            <Toggle
              onClick={() => setValue('popular', !watchPopular)}
              on={watchPopular === true}
            >
              Phổ biến
            </Toggle>
          </Field>
        </div>
        <Field className="items-center">
          <Button loading={loading} type="submit" className="">
            Thêm danh mục mới
          </Button>
        </Field>
      </form>
    </div>
  );
};

export default CategoryAddNew;
