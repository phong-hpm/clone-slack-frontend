import { Props as ReactModalBaseProps } from "react-modal";

export type Position = { top: number; left: number };

export interface ReactModalProps
  extends Pick<
    ReactModalBaseProps,
    | "style"
    | "portalClassName"
    | "className"
    | "overlayClassName"
    | "onAfterOpen"
    | "onRequestClose"
    | "onAfterClose"
    | "overlayRef"
    | "contentRef"
    | "id"
  > {}
