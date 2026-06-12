import { socketManager } from '../socket';

let accessToken: string | null = null;

export const getAccessToken = () => {
  return accessToken;
};

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    socketManager.reconnectWithToken(token);
  }
};

export const clearAccessToken = () => {
  accessToken = null;
};
