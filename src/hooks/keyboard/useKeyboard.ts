import React, { KeyboardEventHandler, useCallback, useEffect } from "react";

// utils
import { eventKeys } from "utils/constants";

type TargetType = { element: HTMLElement } & ({ keyDown: boolean } | { keyUp: boolean });

export type UseKeyboardType = (props: {
  target?: TargetType;
  keyDownListener?: KeyboardEventHandler | Record<string, KeyboardEventHandler>;
  keyUpListener?: KeyboardEventHandler | Record<string, KeyboardEventHandler>;
}) => {
  handleKeyDown: KeyboardEventHandler;
  handleKeyUp: KeyboardEventHandler;
};

const useKeyboard: UseKeyboardType = ({ target, keyDownListener, keyUpListener }) => {
  const handleKeyDown = useCallback<KeyboardEventHandler>(
    (event) => {
      if (keyDownListener) {
        if (typeof keyDownListener === "function") {
          keyDownListener(event);
        } else {
          if (keyDownListener[event.keyCode]) {
            if (keyDownListener[eventKeys.BEFORE_ALL]) {
              keyDownListener[eventKeys.BEFORE_ALL](event);
            }

            keyDownListener[event.keyCode](event);

            if (keyDownListener[eventKeys.AFTER_ALL]) {
              keyDownListener[eventKeys.AFTER_ALL](event);
            }
          }
        }
      }
    },
    [keyDownListener]
  );

  const handleKeyUp = useCallback<KeyboardEventHandler>(
    (event) => {
      if (keyUpListener) {
        if (typeof keyUpListener === "function") {
          keyUpListener(event);
        } else {
          if (keyUpListener[event.keyCode]) {
            if (keyUpListener[eventKeys.BEFORE_ALL]) {
              keyUpListener[eventKeys.BEFORE_ALL](event);
            }

            keyUpListener[event.keyCode](event);

            if (keyUpListener[eventKeys.AFTER_ALL]) {
              keyUpListener[eventKeys.AFTER_ALL](event);
            }
          }
        }
      }
    },
    [keyUpListener]
  );

  // add [keydown] listener to [target.element]
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) =>
      handleKeyDown(event as unknown as React.KeyboardEvent);

    if (target && "keyDown" in target) {
      if (target?.element && target?.keyDown) {
        target.element.addEventListener("keydown", onKeyDown);
      }
    }

    return () => target?.element?.removeEventListener("keydown", onKeyDown);
  }, [target, handleKeyDown]);

  // add [keyup] listener to [target.element]
  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      handleKeyUp(event as unknown as React.KeyboardEvent);
    };

    if (target && "keyUp" in target) {
      if (target?.element && target?.keyUp) {
        target.element.addEventListener("keydown", onKeyUp);
      }
    }

    return () => target?.element?.removeEventListener("keyup", onKeyUp);
  }, [target, handleKeyUp]);

  return { handleKeyDown, handleKeyUp };
};

export default useKeyboard;
