/** Persists the most recently rendered joined-room path for each account. */
import { matchPath } from 'react-router-dom';
import { DIRECT_ROOM_PATH, HOME_ROOM_PATH, SPACE_ROOM_PATH } from '../pages/paths';

const LAST_OPENED_ROOM = 'lastOpenedRoom';
const ROOM_PATHS = [HOME_ROOM_PATH, DIRECT_ROOM_PATH, SPACE_ROOM_PATH] as const;

const getStoreKey = (userId: string): string => `${LAST_OPENED_ROOM}${userId}`;

const isRoomPath = (path: string): boolean =>
  ROOM_PATHS.some((roomPath) => matchPath({ path: roomPath, end: true }, path));

export const getLastOpenedRoomPath = (userId: string): string | undefined => {
  const path = localStorage.getItem(getStoreKey(userId));
  if (!path || !isRoomPath(path)) return undefined;

  return path;
};

export const setLastOpenedRoomPath = (userId: string, path: string): void => {
  if (!isRoomPath(path)) return;

  localStorage.setItem(getStoreKey(userId), path);
};

export const clearLastOpenedRoomPath = (userId: string): void => {
  localStorage.removeItem(getStoreKey(userId));
};
