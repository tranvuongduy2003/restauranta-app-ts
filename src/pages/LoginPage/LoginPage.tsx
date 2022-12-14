import React from 'react';
import Field from 'components/Field';
import Label from 'components/Label';
import Input from 'components/Input';
import Button from 'components/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import { login } from 'features/auth/userSlice';
import { ILogin } from 'utils/interface';
import { useAppDispatch } from 'app/hooks';

const authSchema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
  password: yup.string().required('Mật khẩu không được để trống'),
});

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(authSchema),
  });

  const handleLogin: SubmitHandler<ILogin> = async (data) => {
    try {
      await dispatch(login(data));
      toast.success('Đăng nhập thành công');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <div className="flex-1 bg-white max-w-[600px] p-10 rounded-lg">
        <img
          src="/logo/main-logo.png"
          alt="Logo"
          className="w-20 h-20 mx-auto mb-5"
        />
        <h2 className="font-semibold text-center text-primary text-[40px] mb-10">
          Restaurant App
        </h2>
        <form onSubmit={handleSubmit(handleLogin)} className="mx-auto my-0">
          <Field>
            <Label name="email">Email:</Label>
            <Input
              control={control as any}
              name="email"
              placeholder="Nhập địa chỉ email"
            ></Input>
            {errors?.email && (
              <ErrorMessage>{errors?.email.message}</ErrorMessage>
            )}
          </Field>
          <Field>
            <Label name="password">Mật khẩu:</Label>
            <Input
              control={control as any}
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
            ></Input>
            {errors?.password && (
              <ErrorMessage>{errors?.password.message}</ErrorMessage>
            )}
          </Field>
          <Field className="items-center mb-0">
            <Button type="submit">Đăng nhập</Button>
          </Field>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
