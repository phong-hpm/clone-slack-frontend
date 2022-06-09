import { platformSortName } from "utils/constants";
import { detectPlatform, getPlatform } from "utils/detectplatform";

const platformGetter = jest.spyOn(window.navigator, "platform", "get");

describe("detectPlatform", () => {
  test("When Macos", () => {
    platformGetter.mockReturnValue("MacIntel");
    expect(detectPlatform()).toEqual({
      isAndroid: false,
      isIos: false,
      isMac: true,
      isWindow: false,
    });
  });

  test("When Window", () => {
    platformGetter.mockReturnValue("Window");
    expect(detectPlatform()).toEqual({
      isAndroid: false,
      isIos: false,
      isMac: false,
      isWindow: true,
    });
  });

  test("When iPhone", () => {
    platformGetter.mockReturnValue("iPhone");
    expect(detectPlatform()).toEqual({
      isAndroid: false,
      isIos: true,
      isMac: false,
      isWindow: false,
    });
  });

  test("When Android", () => {
    platformGetter.mockReturnValue("Android");
    expect(detectPlatform()).toEqual({
      isAndroid: true,
      isIos: false,
      isMac: false,
      isWindow: false,
    });
  });

  test("When not found", () => {
    platformGetter.mockReturnValue("");
    expect(detectPlatform()).toEqual({
      isAndroid: false,
      isIos: false,
      isMac: false,
      isWindow: false,
    });
  });
});

describe("getPlatform", () => {
  test("When Macos", () => {
    platformGetter.mockReturnValue("MacIntel");
    expect(getPlatform()).toEqual(platformSortName.MAC);
  });

  test("When Window", () => {
    platformGetter.mockReturnValue("Window");
    expect(getPlatform()).toEqual(platformSortName.WINDOW);
  });

  test("When iPhone", () => {
    platformGetter.mockReturnValue("iPhone");
    expect(getPlatform()).toEqual(platformSortName.IOS);
  });

  test("When Android", () => {
    platformGetter.mockReturnValue("Android");
    expect(getPlatform()).toEqual(platformSortName.ANDROID);
  });

  test("When not found", () => {
    platformGetter.mockReturnValue("");
    expect(getPlatform()).toEqual("");
  });
});
