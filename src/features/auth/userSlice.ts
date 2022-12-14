import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ILogin } from 'utils/interface';
import userApi from '../../api/userApi';
import storage from 'redux-persist/lib/storage';

export const login = createAsyncThunk('user/login', async (payload: ILogin) => {
  const data: any = await userApi.login(payload);
  await storage.setItem('access_token', data.accessToken);
  await storage.setItem('refresh_token', data.refreshToken);
  const userData: any = await userApi.get(data.userId);
  await storage.setItem('user', JSON.stringify(userData.user));
  return {
    user: userData.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
});

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { getState }) => {
    const state = getState() as any;
    await userApi.logout(state.user._id);
    storage.removeItem('refresh_token');
    storage.removeItem('access_token');
    storage.removeItem('user');
    return { accessToken: '', refreshToken: '', user: {} };
  }
);

type UserType = {
  user: any;
  accessToken: string;
  refreshToken: string;
};

const initialState: UserType = {
  user: {},
  accessToken: '',
  refreshToken: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(login.rejected, (state, action) => {
      throw action.error;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(logout.rejected, (state, action) => {
      throw action.error;
    });
  },
});

export const { setUser } = userSlice.actions;

export const user = (state: RootState) => state.user;

export default userSlice.reducer;
