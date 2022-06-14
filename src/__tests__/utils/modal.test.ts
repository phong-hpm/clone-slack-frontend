import {
  computeAnchorPosition,
  computeOverViewportPosition,
  computeTransformPosition,
} from "utils/modal";

const oldPosition = { left: 0, top: 0 };
const mockElement = {
  getBoundingClientRect: () => ({ width: 200, height: 200 }),
} as unknown as HTMLDivElement;

describe("computeTransformPosition", () => {
  test("When origin placement are center-top (default)", () => {
    const position = computeTransformPosition(oldPosition, mockElement);
    expect(position).toEqual({ left: -100, top: 0 });
  });

  test("When origin placement are right-center", () => {
    const position = computeTransformPosition(oldPosition, mockElement, {
      horizontal: "right",
      vertical: "center",
    });
    expect(position).toEqual({ left: -200, top: -100 });
  });

  test("When origin placement are left-bottom", () => {
    const position = computeTransformPosition(oldPosition, mockElement, {
      horizontal: "left",
      vertical: "bottom",
    });
    expect(position).toEqual({ left: 0, top: -200 });
  });
});

describe("computeAnchorPosition", () => {
  test("When origin placement are center-top (default)", () => {
    const position = computeAnchorPosition(oldPosition, mockElement);
    expect(position).toEqual({ left: 100, top: 0 });
  });

  test("When origin placement are right-center", () => {
    const position = computeAnchorPosition(oldPosition, mockElement, {
      horizontal: "right",
      vertical: "center",
    });
    expect(position).toEqual({ left: 200, top: 100 });
  });

  test("When origin placement are left-bottom", () => {
    const position = computeAnchorPosition(oldPosition, mockElement, {
      horizontal: "left",
      vertical: "bottom",
    });
    expect(position).toEqual({ left: 0, top: 200 });
  });
});

describe("computeOverViewportPosition", () => {
  test("When modal inside viewport and too close viewport border", () => {
    let position = computeOverViewportPosition({ left: 0, top: 0 }, mockElement);
    expect(position).toEqual({ left: 16, top: 16 });
  });

  test("When modal inside viewport", () => {
    let position = computeOverViewportPosition({ left: 100, top: 100 }, mockElement);
    expect(position).toEqual({ left: 100, top: 100 });
  });

  test("When modal over right side of viewport", () => {
    let position = computeOverViewportPosition({ left: 1200, top: 100 }, mockElement);
    expect(position).toEqual({ left: 1024 - 16 - 200, top: 100 });
  });

  test("When modal over bottom side of viewport", () => {
    let position = computeOverViewportPosition({ left: 100, top: 1200 }, mockElement);
    expect(position).toEqual({ left: 100, top: 768 - 16 - 200 });
  });
});
