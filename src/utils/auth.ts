export function getAccessToken() {
  const accessToken = localStorage.getItem('access_token');
  return accessToken;
}
