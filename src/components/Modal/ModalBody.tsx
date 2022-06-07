import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// components
import { Box, BoxProps } from "@mui/material";

export interface ModalBodyProps extends BoxProps {
  // this prop will be set by [Modal] component
  onCanScroll?: (bol: boolean) => void;
}

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ onCanScroll, children, ...props }, ref) => {
    const bodyRef = useRef<HTMLDivElement>();

    useImperativeHandle(ref, () => bodyRef.current!);

    useEffect(() => {
      if (!bodyRef.current || !onCanScroll) return;

      const bodyElement = bodyRef.current;

      const observer = new ResizeObserver((entries) => {
        const { clientHeight, scrollHeight } = entries[0].target as HTMLDivElement;
        onCanScroll(scrollHeight > clientHeight);
      });

      observer.observe(bodyElement);

      // don't remove this [return], because [ResizeObserver] will fire [onCanScroll]
      //   althought [Modal] was unmounted
      // [observer.unobserve] will make sure this case will not happen
      return () => observer.unobserve(bodyElement);
    }, [onCanScroll]);

    return (
      <Box ref={bodyRef} flex="1" px={3} py={2.5} overflow="auto" {...props}>
        {children}
      </Box>
    );
  }
);

export default ModalBody;
