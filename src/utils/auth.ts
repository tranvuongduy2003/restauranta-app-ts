import userApi from 'api/userApi';

export function getAccessToken() {
  const accessToken: string = localStorage.getItem('access_token') as string;
  return accessToken;
}

export async function refreshToken() {
  const refreshToken: string = localStorage.getItem('refresh_token') as any;
  const accessToken = await userApi.refreshToken(refreshToken);
  return accessToken;
}
