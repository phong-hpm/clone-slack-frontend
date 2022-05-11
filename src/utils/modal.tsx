import { PopoverOrigin } from "@mui/material";

export const minSpacing = 16;

export const computeAnchorPosition = (
  oldPosition: { left: number; top: number },
  anchorElement: Element,
  origin?: PopoverOrigin
) => {
  const position = { ...oldPosition };

  const { width: anchorWidth, height: anchorHeight } = anchorElement.getBoundingClientRect();
  const { horizontal = "center", vertical = "top" } = origin || {};

  // anchor X
  if (horizontal === "center") position.left += anchorWidth / 2;
  else if (horizontal === "right") position.left += anchorWidth;
  else if (horizontal === "left") position.left += 0;

  // anchor Y
  if (vertical === "center") position.top += anchorHeight / 2;
  else if (vertical === "top") position.top += 0;
  else if (vertical === "bottom") position.top += anchorHeight;

  return position;
};

export const computeTransformPosition = (
  oldPosition: { left: number; top: number },
  contentElement: Element,
  origin?: PopoverOrigin,
  extraOrigin?: { horizontal?: number; vertical?: number }
) => {
  const position = { ...oldPosition };

  const { width: contentWidth, height: contentHeight } = contentElement.getBoundingClientRect();
  const { horizontal = "center", vertical = "top" } = origin || {};
  const { horizontal: horizontalExtra = 0, vertical: verticalExtra = 0 } = extraOrigin || {};

  // transform X
  if (horizontal === "center") position.left -= contentWidth / 2;
  else if (horizontal === "right") position.left -= contentWidth + horizontalExtra;
  else if (horizontal === "left") position.left += horizontalExtra;

  // transform Y
  if (vertical === "center") position.top -= contentHeight / 2;
  else if (vertical === "top") position.top += verticalExtra;
  else if (vertical === "bottom") position.top -= contentHeight + verticalExtra;

  return position;
};

export const computeOverViewportPosition = (
  oldPosition: { left: number; top: number },
  contentElement: HTMLDivElement
) => {
  const position = { ...oldPosition };
  const { width: contentWidth, height: contentHeight } = contentElement.getBoundingClientRect();

  // check modal is over viewport
  // over left postion of viewport
  if (position.left < minSpacing) {
    position.left = 16;
  }

  // over top postion of viewport
  if (position.top < minSpacing) {
    position.top = 16;
  }

  // over right postion of viewport
  if (position.left + contentWidth > window.innerWidth - minSpacing) {
    position.left = window.innerWidth - minSpacing - contentWidth;
  }

  // over bottom postion of viewport
  if (position.top + contentHeight > window.innerHeight - minSpacing) {
    position.top = window.innerHeight - minSpacing - contentHeight;
  }

  return position;
};
