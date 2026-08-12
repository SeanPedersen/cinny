/** In-app notifications for completed desktop downloads. */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Icon, Icons, Text } from 'folds';
import {
  DOWNLOAD_COMPLETE_EVENT,
  DownloadCompleteEventDetail,
  openDownloadsDirectory,
} from '../../utils/download';
import * as css from './DownloadNotification.css';

const NOTIFICATION_DURATION_MS = 5_000;

type DownloadNotificationItem = DownloadCompleteEventDetail & {
  id: number;
};

type DownloadNotificationProps = {
  item: DownloadNotificationItem;
  onDismiss: (id: number) => void;
};

function DownloadNotification({ item, onDismiss }: DownloadNotificationProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(item.id), NOTIFICATION_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [item.id, onDismiss]);

  const handleOpenDownloads = async () => {
    await openDownloadsDirectory();
    onDismiss(item.id);
  };

  return (
    <Box className={css.Notification} alignItems="Center" gap="200">
      <Icon size="200" src={Icons.Check} />
      <Box direction="Column" grow="Yes" gap="100">
        <Text size="B300" truncate>
          {item.filename} saved
        </Text>
        <Text
          as="button"
          type="button"
          className={css.DirectoryLink}
          size="T200"
          onClick={handleOpenDownloads}
        >
          Open Downloads
        </Text>
      </Box>
    </Box>
  );
}

export function DownloadNotifications() {
  const nextIdRef = useRef(0);
  const [items, setItems] = useState<DownloadNotificationItem[]>([]);

  const handleDismiss = useCallback((id: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    const handleDownloadComplete = (event: Event) => {
      const { detail } = event as CustomEvent<DownloadCompleteEventDetail>;
      const item = { id: nextIdRef.current, ...detail };
      nextIdRef.current += 1;
      setItems((currentItems) => [...currentItems, item]);
    };

    window.addEventListener(DOWNLOAD_COMPLETE_EVENT, handleDownloadComplete);
    return () => window.removeEventListener(DOWNLOAD_COMPLETE_EVENT, handleDownloadComplete);
  }, []);

  if (items.length === 0) return null;

  return (
    <Box
      className={css.NotificationStack}
      direction="Column"
      alignItems="End"
      gap="200"
      aria-live="polite"
    >
      {items.map((item) => (
        <DownloadNotification key={item.id} item={item} onDismiss={handleDismiss} />
      ))}
    </Box>
  );
}
