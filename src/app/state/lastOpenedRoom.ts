/** Persists the most recently rendered joined-room path for each account. */
import { matchPath } from 'react-router-dom';
import { DIRECT_ROOM_PATH, HOME_ROOM_PATH, SPACE_ROOM_PATH } from '../pages/paths';

const LAST_OPENED_ROOM = 'lastOpenedRoom';
const ROOM_PATHS = [HOME_ROOM_PATH, DIRECT_ROOM_PATH, SPACE_ROOM_PATH] as const;

const getStoreKey = (userId: string): string => `${LAST_OPENED_ROOM}${userId}`;

const getRoomPath = (path: string): string | undefined => {
  const match = ROOM_PATHS.map((roomPath) => matchPath({ path: roomPath, end: true }, path)).find(
    (roomMatch) => roomMatch !== null
  );
  if (!match) return undefined;
  if (!match.params.eventId) return path;

  const pathParts = path.split('/');
  const trailingEmptyPartCount = path.endsWith('/') ? 1 : 0;
  const eventPartIndex = pathParts.length - trailingEmptyPartCount - 1;
  pathParts.splice(eventPartIndex, 1);
  return pathParts.join('/');
};

export const getLastOpenedRoomPath = (userId: string): string | undefined => {
  const path = localStorage.getItem(getStoreKey(userId));
  if (!path) return undefined;

  return getRoomPath(path);
};

export const setLastOpenedRoomPath = (userId: string, path: string): void => {
  const roomPath = getRoomPath(path);
  if (!roomPath) return;

  localStorage.setItem(getStoreKey(userId), roomPath);
};

export const clearLastOpenedRoomPath = (userId: string): void => {
  localStorage.removeItem(getStoreKey(userId));
};
