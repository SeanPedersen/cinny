/** Layout and appearance for download-complete notifications. */
import { style } from '@vanilla-extract/css';
import { DefaultReset, FocusOutline, color, config } from 'folds';

export const NotificationStack = style({
  position: 'fixed',
  right: config.space.S400,
  bottom: `calc(${config.space.S700} + ${config.space.S700})`,
  zIndex: config.zIndex.Max,
  maxWidth: `calc(100vw - ${config.space.S400} - ${config.space.S400})`,
  pointerEvents: 'none',
});

export const Notification = style({
  width: config.size.ModalWidth300,
  maxWidth: '100%',
  padding: config.space.S300,
  color: color.Surface.OnContainer,
  backgroundColor: color.Surface.Container,
  border: `${config.borderWidth.B300} solid ${color.Surface.ContainerLine}`,
  borderRadius: config.radii.R400,
  boxShadow: config.shadow.E300,
  pointerEvents: 'auto',
});

export const DirectoryLink = style([
  DefaultReset,
  FocusOutline,
  {
    width: 'fit-content',
    color: color.Primary.Main,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
]);
