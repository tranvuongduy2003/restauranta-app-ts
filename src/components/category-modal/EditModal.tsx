import Button from 'components/Button';
import ErrorMessage from 'components/ErrorMessage';
import Field from 'components/Field';
import Input from 'components/Input';
import Label from 'components/Label';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import categoryApi from 'api/categoryApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Toggle from 'components/Toggle';
import {
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from 'firebase-config';

const categorySchema = yup.object({
  name: yup.string().required('Tên danh mục không được để trống'),
});

interface IEditModalProps {
  handleClose: () => void;
  //fix item
  item: any;
}

interface FormValues {
  name: string;
  image: string;
  imageRef: string;
  popular: boolean;
}

type Image = {
  url: string;
  ref: string;
};

const EditModal: React.FC<IEditModalProps> = ({ handleClose, item }) => {
  const [deletedImage, setDeletedImage] = useState<Image>();
  const [currentImage, setCurrentImage] = useState<Image>({
    url: item.image,
    ref: item.imageRef,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: item.name,
      image: item.image,
      imageRef: item.imageRef,
      popular: item.popular,
    },
    resolver: yupResolver(categorySchema),
  });

  const watchPopular = watch('popular');

  const handleReplaceImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    setDeletedImage(currentImage);
    setLoading(true);
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
          .then((downloadURL) => {
            setCurrentImage({
              url: downloadURL,
              ref: uploadTask.snapshot.metadata.fullPath,
            });
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };

  const handleUpdateCategory = async (data: FormValues) => {
    try {
      if (deletedImage) {
        const imageRef = ref(storage, deletedImage.ref);
        await deleteObject(imageRef);
      }
      await categoryApi.update(item._id, {
        ...data,
        image: currentImage.url,
        imageRef: currentImage.ref,
      });
      handleClose();
      toast.success('Cập nhật món ăn thành công!');
    } catch (error) {
      toast.error('Cập nhật món ăn không thành công!');
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdateCategory)}
      className="grid grid-cols-2 gap-10"
    >
      <div className="flex flex-col justify-start w-full gap-5 mx-auto">
        <Field>
          <Label name="name">Tên danh mục</Label>
          <Input
            control={control as any}
            name="name"
            placeholder="Nhập tên danh mục"
          ></Input>
          {errors.name && (
            <ErrorMessage>{errors.name.message as string}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Phổ biến</Label>
          <Toggle
            onClick={() => setValue('popular', !watchPopular)}
            on={watchPopular === true}
          ></Toggle>
        </Field>
      </div>
      <div className="relative flex items-center justify-between">
        <label
          htmlFor="image"
          className="absolute z-50 w-auto px-4 py-2 text-sm font-medium bg-white rounded-full cursor-pointer text-primary top-2 right-2"
        >
          Thay đổi ảnh
        </label>
        {!loading ? (
          <img
            src={currentImage.url}
            alt=""
            className="object-cover w-full h-[300px] rounded-lg"
          />
        ) : (
          <div className="bg-gray-300 w-full h-[300px] rounded-lg animate-pulse"></div>
        )}
        <input
          type="file"
          name="image"
          id="image"
          className="hidden"
          onChange={(e) => handleReplaceImage(e)}
        />
      </div>
      <Field className="items-center !mb-0 col-span-full">
        <Button loading={loading} type="submit" className="mb-0">
          Lưu
        </Button>
      </Field>
    </form>
  );
};

export default EditModal;
