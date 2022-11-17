import categoryApi from 'api/categoryApi';
import Button from 'components/Button';
import { Dropdown } from 'components/dropdown';
import Field from 'components/Field';
import Input from 'components/Input';
import Label from 'components/Label';
import TextArea from 'components/TextArea';
import Toggle from 'components/Toggle';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Heading from '../Dashboard/Heading';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
} from 'firebase/storage';
import { storage } from 'firebase-config';
import foodApi from 'api/foodApi';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from 'components/ErrorMessage';
import { ICategory, IFood } from 'utils/interface';

const foodSchema = yup.object({
  name: yup.string().required('Tên món ăn không được để trống.'),
  price: yup
    .number()
    .typeError('Giá trị không phù hợp')
    .required('Giá không được để trống'),
  categoryId: yup.string().required('Chọn một danh mục'),
  description: yup.string(),
});

const HomePage: React.FC = () => {
  const fileRef = useRef<any>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IFood>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      categoryId: '',
      images: [],
      description: '',
      bestDeals: false,
      popular: false,
    },
    resolver: yupResolver(foodSchema),
  });

  useEffect(() => {
    try {
      const handleFetchCategories = async () => {
        const data: any = await categoryApi.getAll();
        const { categories } = data;
        setCategories(categories);
      };
      handleFetchCategories();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const watchBest = watch('bestDeals');
  const watchPopular = watch('popular');

  const [selectCategory, setSelectCategory] = useState<ICategory>();

  const handleSelectOption = (item: ICategory) => {
    if (item._id) {
      setValue('categoryId', item._id);
      setSelectCategory(item);
    }
  };

  const handleUploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesLength = e.target.files?.length || 0;
    for (let index = 0; index < filesLength; index++) {
      const newFile: File = e.target.files?.item(index) as File;
      setFiles((prevFiles) => [...prevFiles, newFile]);
    }
  };

  const handleAddNewFood = async (data: IFood) => {
    const promises: UploadTask[] = [];
    files.forEach((file) => {
      const storageRef = ref(storage, 'images/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      promises.push(uploadTask);
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
        }
      );
    });

    setLoading(true);
    await Promise.all(promises)
      .then(async (response) => {
        return await Promise.all(
          response.map(async (item) => {
            const downloadUrl = await getDownloadURL(item.ref);
            return { ref: item.metadata.fullPath, url: downloadUrl };
          })
        );
      })
      .then(async (imagesData) => {
        console.log({
          ...data,
          categoryId: selectCategory?._id,
          images: imagesData,
        });
        try {
          await foodApi.add({
            ...data,
            categoryId: selectCategory?._id,
            images: imagesData,
          });
          reset({
            name: '',
            categoryId: '',
            images: [],
            description: '',
            bestDeals: false,
            popular: false,
          });
          fileRef.current.value = null;
          setFiles([]);
          setSelectCategory(undefined);
          toast.success('Tạo món ăn thành công!');
        } catch (error) {
          toast.error('Tạo món ăn thất bại!');
          console.log(error);
        }
      })
      .catch((error) => {
        toast.error('Tạo món ăn thất bại!');
        console.log(error);
      });
    setLoading(false);
  };

  return (
    <div>
      <Heading title="Thêm món ăn" desc="Thêm món ăn mới"></Heading>
      <form
        onSubmit={handleSubmit(handleAddNewFood)}
        className="grid grid-cols-2 gap-x-10 "
      >
        <div className="flex flex-col justify-start gap-5">
          <Field>
            <Label name="name">Tên món ăn</Label>
            <Input
              control={control as any}
              name="name"
              placeholder="Nhập tên món ăn"
            ></Input>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </Field>
          <Field>
            <Label>Tải ảnh</Label>
            <input
              ref={fileRef}
              type="file"
              name="file"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleUploadFiles(e)}
              required
              multiple
            ></input>
          </Field>
          <Field>
            <Label name="category">Danh mục</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={`${
                  selectCategory ? selectCategory.name : 'Chọn danh mục'
                }`}
              ></Dropdown.Select>
              <Dropdown.List>
                {categories?.map((item) => (
                  <Dropdown.Option
                    key={item._id}
                    onClick={() => handleSelectOption(item)}
                  >
                    {item.name}
                  </Dropdown.Option>
                ))}
              </Dropdown.List>
            </Dropdown>
            {errors.categoryId && (
              <ErrorMessage>{errors.categoryId.message}</ErrorMessage>
            )}
          </Field>
          <Field className="!flex-row gap-x-20">
            <Toggle
              onClick={() => setValue('bestDeals', !watchBest)}
              on={watchBest === true}
            >
              Best Deals
            </Toggle>
            <Toggle
              onClick={() => setValue('popular', !watchPopular)}
              on={watchPopular === true}
            >
              Phổ biến
            </Toggle>
          </Field>
        </div>
        <div className="flex flex-col justify-start gap-5">
          <Field>
            <Label name="price">Giá</Label>
            <Input
              control={control as any}
              name="price"
              placeholder="Nhập giá món ăn"
            ></Input>
            {errors.price && (
              <ErrorMessage>{errors.price.message}</ErrorMessage>
            )}
          </Field>
          <Field>
            <Label name="description">Mô tả</Label>
            <TextArea
              control={control as any}
              height="300px"
              name="description"
              placeholder="Nhập mô tả về món ăn"
            ></TextArea>
          </Field>
        </div>
        <Field className="mx-auto col-span-full">
          <Button loading={loading} type="submit">
            Thêm món ăn mới
          </Button>
        </Field>
      </form>
    </div>
  );
};

export default HomePage;
