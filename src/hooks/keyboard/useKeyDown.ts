import React, { KeyboardEventHandler, useCallback, useEffect } from "react";

export type UseKeyDownType = <T extends Function>(
  keyCode: string | string[],
  callback: T,
  element?: HTMLElement
) => T;

const useKeyDown: UseKeyDownType = (keyCode, callback, element) => {
  const handleKeyDown = useCallback<KeyboardEventHandler>(
    (event) => {
      if (!callback) return;
      if (typeof keyCode === "string" && keyCode !== String(event.keyCode)) return;
      if (typeof keyCode !== "string" && !keyCode.includes(String(event.keyCode))) return;

      callback();
    },
    [keyCode, callback]
  );

  useEffect(() => {
    const target = element || (document.body as HTMLElement);

    const onKeyDown = (event: KeyboardEvent) =>
      handleKeyDown(event as unknown as React.KeyboardEvent);

    target.addEventListener("keydown", onKeyDown);
    return () => target.removeEventListener("keydown", onKeyDown);
  }, [keyCode, element, handleKeyDown]);

  return callback;
};

export default useKeyDown;
