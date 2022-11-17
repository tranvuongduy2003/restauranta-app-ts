import foodApi from 'api/foodApi';
import Button from 'components/Button';
import { Dropdown } from 'components/dropdown';
import ErrorMessage from 'components/ErrorMessage';
import Field from 'components/Field';
import Input from 'components/Input';
import Label from 'components/Label';
import TextArea from 'components/TextArea';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import categoryApi from 'api/categoryApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Toggle from 'components/Toggle';
import {
  getDownloadURL,
  uploadBytesResumable,
  ref,
  deleteObject,
} from 'firebase/storage';
import { storage } from 'firebase-config';
import { ICategory, IFood, Image } from 'utils/interface';

const foodSchema = yup.object({
  name: yup.string().required('Tên món ăn không được để trống.'),
  price: yup
    .number()
    .typeError('Giá trị không phù hợp')
    .required('Giá không được để trống'),
  categoryId: yup.string().required('Chọn một danh mục'),
  description: yup.string(),
});

interface IEditModalProps {
  handleClose?: () => void;
  item: IFood;
}

const EditModal: React.FC<IEditModalProps> = ({ handleClose, item }) => {
  const fileRef = useRef(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectCategory, setSelectCategory] = useState<ICategory>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentImages, setCurrentImages] = useState<Image[]>([
    item.images,
  ] as Image[]);
  const [deletedImages, setDeletedImages] = useState<Image[]>([]);
  // const [uploadImages, setUploadImages] = useState(item.images);
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: item.name,
      categoryId: item.categoryId,
      price: item.price,
      images: item.images,
      description: item.description,
      bestDeals: item.bestDeals,
      popular: item.popular,
    },
    resolver: yupResolver(foodSchema),
  });

  useEffect(() => {
    try {
      const handleFetchCategories = async () => {
        const data: any = await categoryApi.getAll();
        const categories = data.categories;
        setCategories(categories);
        setSelectCategory(
          categories.find(
            (category: ICategory) => category._id === item.categoryId
          )
        );
      };
      handleFetchCategories();
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watchBest = watch('bestDeals');
  const watchPopular = watch('popular');

  const handleSelectOption = (item: ICategory) => {
    setValue('categoryId', item._id);
    setSelectCategory(item);
  };

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    const storageRef = ref(storage, 'categories/' + file?.name);
    setLoading(true);
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
          .then((downloadURL) => {
            setCurrentImages((prevItem) => [
              ...prevItem,
              {
                url: downloadURL,
                ref: uploadTask.snapshot.metadata.fullPath,
              },
            ]);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };

  const handleDeleteImage = (image: Image, index: number) => {
    setDeletedImages((prevItem) => [...prevItem, image]);
    let images = [...currentImages];
    images.splice(index, 1);
    setCurrentImages(images);
  };

  const handleUpdateFood = async (data: IFood) => {
    try {
      await Promise.all(
        deletedImages.map(async (image) => {
          const imageRef = ref(storage, image.ref);
          const deletedImage = await deleteObject(imageRef);
          return deletedImage;
        })
      );
      if (item._id) {
        await foodApi.update(item._id, { ...data, images: currentImages });
      } else {
        throw new Error('_id is undefined');
      }
      handleClose && handleClose();
      toast.success('Cập nhật món ăn thành công!');
    } catch (error) {
      toast.error('Cập nhật món ăn không thành công!');
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdateFood)}
      className="grid grid-cols-2 gap-x-10"
    >
      <div className="flex flex-col justify-start gap-5">
        <Field>
          <Label name="name">Tên món ăn</Label>
          <Input
            control={control as any}
            name="name"
            placeholder="Nhập tên món ăn"
          ></Input>
          {errors.name && (
            <ErrorMessage>{errors.name.message as string}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Tải ảnh</Label>
          <div className="flex items-center gap-x-2">
            {currentImages.length > 0 &&
              currentImages.map((image, index) => (
                <div className="relative w-20 h-20" key={index}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute w-6 h-6 p-1 bg-white rounded-full cursor-pointer top-1 right-1"
                    onClick={() => handleDeleteImage(image, index)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <img
                    src={image.url}
                    alt=""
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              ))}
            {currentImages.length < 5 && (
              <label
                className="flex items-center justify-center w-20 h-20 text-white rounded-lg cursor-pointer bg-slate-200"
                htmlFor="image"
              >
                {loading ? (
                  <span className="inline-block w-8 h-8 border-[3px] border-white rounded-full border-r-transparent animate-spin"></span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                )}
              </label>
            )}
            <input
              ref={fileRef}
              type="file"
              name="image"
              id="image"
              className="hidden"
              onChange={(e) => handleAddImage(e)}
            />
          </div>
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
            <ErrorMessage>{errors.categoryId.message as string}</ErrorMessage>
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
            <ErrorMessage>{errors.price.message as string}</ErrorMessage>
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
      <Field className="mx-auto mt-6 mb-0 col-span-full">
        <Button type="submit" className="">
          Lưu
        </Button>
      </Field>
    </form>
  );
};

export default EditModal;
