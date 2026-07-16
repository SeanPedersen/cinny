/** Displays a non-layout-shifting alert when Matrix synchronization fails. */
import { MatrixClient, SyncState } from 'matrix-js-sdk';
import React, { useCallback, useState } from 'react';
import FocusTrap from 'focus-trap-react';
import {
  Box,
  Button,
  config,
  Dialog,
  Header,
  Overlay,
  OverlayBackdrop,
  OverlayCenter,
  Text,
} from 'folds';
import { useSyncState } from '../../hooks/useSyncState';
import { stopPropagation } from '../../utils/keyboard';

type SyncStatusData = {
  current: SyncState | null;
  errorDismissed: boolean;
};

type SyncStatusProps = {
  mx: MatrixClient;
};

export function SyncStatus({ mx }: SyncStatusProps) {
  const [status, setStatus] = useState<SyncStatusData>({
    current: null,
    errorDismissed: false,
  });

  useSyncState(
    mx,
    useCallback((current) => {
      setStatus((previousStatus) => ({
        current,
        errorDismissed: current === SyncState.Error ? previousStatus.errorDismissed : false,
      }));
    }, [])
  );

  const dismissError = () => {
    setStatus((previousStatus) => ({ ...previousStatus, errorDismissed: true }));
  };

  if (status.current !== SyncState.Error || status.errorDismissed) {
    return null;
  }

  return (
    <Overlay open backdrop={<OverlayBackdrop />}>
      <OverlayCenter>
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
            clickOutsideDeactivates: true,
            onDeactivate: dismissError,
            escapeDeactivates: stopPropagation,
          }}
        >
          <Dialog variant="Surface">
            <Header
              style={{
                padding: `0 ${config.space.S400}`,
                borderBottomWidth: config.borderWidth.B300,
              }}
              variant="Surface"
              size="500"
            >
              <Text size="H4">Connection Failed</Text>
            </Header>
            <Box style={{ padding: config.space.S400 }} direction="Column" gap="400">
              <Text priority="400">
                Unable to connect to the server. Check your connection and try again.
              </Text>
              <Button variant="Critical" onClick={dismissError}>
                <Text as="span" size="B400">
                  Dismiss
                </Text>
              </Button>
            </Box>
          </Dialog>
        </FocusTrap>
      </OverlayCenter>
    </Overlay>
  );
}
