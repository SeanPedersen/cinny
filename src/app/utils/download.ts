/** Native desktop download helpers. */
/* eslint-disable import/no-extraneous-dependencies */
import { BaseDirectory, downloadDir } from '@tauri-apps/api/path';
import { exists, writeFile } from '@tauri-apps/plugin-fs';
import { openPath } from '@tauri-apps/plugin-opener';

export const DOWNLOAD_COMPLETE_EVENT = 'cinny-download-complete';

export type DownloadCompleteEventDetail = {
  filename: string;
};

const INVALID_FILENAME_CHARACTERS = /[<>:"/\\|?*]/g;
const TRAILING_FILENAME_CHARACTERS = /[. ]+$/g;
const WINDOWS_RESERVED_FILENAME = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
const DEFAULT_FILENAME = 'download';
const MAX_CONTROL_CHARACTER_CODE = 31;

const sanitizeFilename = (filename: string): string => {
  const sanitizedFilename = filename
    .split('')
    .map((character) => (character.charCodeAt(0) <= MAX_CONTROL_CHARACTER_CODE ? '_' : character))
    .join('')
    .replace(INVALID_FILENAME_CHARACTERS, '_')
    .replace(TRAILING_FILENAME_CHARACTERS, '')
    .trim();
  if (!sanitizedFilename) return DEFAULT_FILENAME;
  if (WINDOWS_RESERVED_FILENAME.test(sanitizedFilename)) return `_${sanitizedFilename}`;
  return sanitizedFilename;
};

const getDuplicateFilename = (filename: string, duplicateIndex: number): string => {
  const extensionIndex = filename.lastIndexOf('.');
  if (extensionIndex <= 0) return `${filename} (${duplicateIndex})`;

  const name = filename.slice(0, extensionIndex);
  const extension = filename.slice(extensionIndex);
  return `${name} (${duplicateIndex})${extension}`;
};

const getAvailableFilename = async (filename: string, duplicateIndex = 0): Promise<string> => {
  const availableFilename =
    duplicateIndex === 0 ? filename : getDuplicateFilename(filename, duplicateIndex);
  const filenameExists = await exists(availableFilename, { baseDir: BaseDirectory.Download });
  if (!filenameExists) return availableFilename;

  return getAvailableFilename(filename, duplicateIndex + 1);
};

const notifyDownloadComplete = (filename: string): void => {
  const detail: DownloadCompleteEventDetail = { filename };
  window.dispatchEvent(new CustomEvent(DOWNLOAD_COMPLETE_EVENT, { detail }));
};

export const openDownloadsDirectory = async (): Promise<void> => {
  await openPath(await downloadDir());
};

export const saveToDownloads = async (content: Blob, filename: string): Promise<void> => {
  const availableFilename = await getAvailableFilename(sanitizeFilename(filename));
  const fileData = new Uint8Array(await content.arrayBuffer());

  await writeFile(availableFilename, fileData, {
    baseDir: BaseDirectory.Download,
    createNew: true,
  });
  notifyDownloadComplete(availableFilename);
};
