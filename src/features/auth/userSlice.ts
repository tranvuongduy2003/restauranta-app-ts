import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ILogin } from 'utils/interface';
import userApi from '../../api/userApi';
import storage from 'redux-persist/lib/storage';

export const login = createAsyncThunk('user/login', async (payload: ILogin) => {
  const data: any = await userApi.login(payload);
  await storage.setItem('access_token', data.token);
  await storage.setItem('user', JSON.stringify(data.user));
  return { user: data.user, token: data.token };
});

type UserType = {
  token?: string;
  user: any;
};

const initialState: UserType = {
  token: '',
  user: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      storage.removeItem('access_token');
      storage.removeItem('user');
      state.token = '';
      state.user = {};
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      console.log(action.error);
    });
  },
});

export const { logout } = userSlice.actions;
export const { setUser } = userSlice.actions;

export const user = (state: RootState) => state.user;

export default userSlice.reducer;
