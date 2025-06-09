export type ControlEvent = PointerEvent & {
  stopRequest: boolean;
  stopPropagation: () => void;
};
