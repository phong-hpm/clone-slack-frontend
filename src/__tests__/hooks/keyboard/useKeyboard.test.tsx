import { KeyboardEventHandler } from "react";
import userEvent from "@testing-library/user-event";

// hooks
import useKeyboard, { UseKeyboardType } from "hooks/keyboard/useKeyboard";

// utils
import { customRender } from "__tests__/__setups__";
import { eventKeys } from "utils/constants";

// this component will help us run codes in [useSocket]
const ComponentRenderer = ({ config }: { config: Parameters<UseKeyboardType>[0] }) => {
  useKeyboard(config);
  return <div></div>;
};
const mockEnter = { keyup: jest.fn(), keydown: jest.fn() };
const mockBackspace = { keyup: jest.fn(), keydown: jest.fn() };
const mockBeforeAll = { keyup: jest.fn(), keydown: jest.fn() };
const mockAfterAll = { keyup: jest.fn(), keydown: jest.fn() };
const keydownListeners: Record<string, KeyboardEventHandler> = {
  [eventKeys.KEY_ENTER]: mockEnter.keydown,
  [eventKeys.KEY_BACKSPACE]: mockBackspace.keydown,
};
const keydownAllListeners: Record<string, KeyboardEventHandler> = {
  [eventKeys.BEFORE_ALL]: mockBeforeAll.keydown,
  [eventKeys.AFTER_ALL]: mockAfterAll.keydown,
};
const keyupListeners: Record<string, KeyboardEventHandler> = {
  [eventKeys.KEY_ENTER]: mockEnter.keyup,
  [eventKeys.KEY_BACKSPACE]: mockBackspace.keyup,
};
const keyupAllListeners: Record<string, KeyboardEventHandler> = {
  [eventKeys.BEFORE_ALL]: mockBeforeAll.keyup,
  [eventKeys.AFTER_ALL]: mockAfterAll.keyup,
};

const pressEnterAndExpect = () => {
  const { keydown, keyup } = mockEnter;

  expect(keydown).not.toBeCalled();
  expect(keyup).not.toBeCalled();
  userEvent.keyboard("{enter}");
  expect(keydown).toBeCalledWith(expect.objectContaining({ type: "keydown", keyCode: 13 }));
  expect(keyup).toBeCalledWith(expect.objectContaining({ type: "keyup", keyCode: 13 }));

  keydown.mockClear();
  keyup.mockClear();
};

const pressBackspaceAndExpect = () => {
  const { keydown, keyup } = mockBackspace;

  expect(keydown).not.toBeCalled();
  expect(keyup).not.toBeCalled();
  userEvent.keyboard("{backspace}");
  expect(keydown).toBeCalledWith(expect.objectContaining({ type: "keydown", keyCode: 8 }));
  expect(keyup).toBeCalledWith(expect.objectContaining({ type: "keyup", keyCode: 8 }));

  keydown.mockClear();
  keyup.mockClear();
};

const expectBeforeAfterAll = (keyCode: number) => {
  expect(mockBeforeAll.keydown).toBeCalledWith(
    expect.objectContaining({ type: "keydown", keyCode })
  );
  expect(mockAfterAll.keydown).toBeCalledWith(
    expect.objectContaining({ type: "keydown", keyCode })
  );
  expect(mockBeforeAll.keyup).toBeCalledWith(expect.objectContaining({ type: "keyup", keyCode }));
  expect(mockAfterAll.keyup).toBeCalledWith(expect.objectContaining({ type: "keyup", keyCode }));

  mockBeforeAll.keydown.mockClear();
  mockAfterAll.keydown.mockClear();
  mockBeforeAll.keyup.mockClear();
  mockBeforeAll.keyup.mockClear();
};

test("test with wrong options", () => {
  const config: Parameters<UseKeyboardType>[0] = {
    target: { element: document.body, keyUp: false, keyDown: false },
  };
  customRender(<ComponentRenderer config={config} />);

  userEvent.keyboard("${enter}");
  expect(mockEnter.keydown).not.toBeCalled();
  expect(mockEnter.keyup).not.toBeCalled();
});

test("test without listener", () => {
  const config: Parameters<UseKeyboardType>[0] = {
    target: { element: document.body, keyDown: true, keyUp: true },
  };
  customRender(<ComponentRenderer config={config} />);

  userEvent.keyboard("${enter}");
  expect(mockEnter.keydown).not.toBeCalled();
  expect(mockEnter.keyup).not.toBeCalled();
});

describe("Test single key", () => {
  test("keydown only", () => {
    const config: Parameters<UseKeyboardType>[0] = {
      target: { element: document.body, keyDown: true },
      keyDownListener: mockEnter.keydown,
    };
    customRender(<ComponentRenderer config={config} />);

    userEvent.keyboard("${enter}");
    expect(mockEnter.keydown).toBeCalledWith(
      expect.objectContaining({ type: "keydown", keyCode: 36 })
    );
    expect(mockEnter.keyup).not.toBeCalled();
  });

  test("keyup only", () => {
    const config: Parameters<UseKeyboardType>[0] = {
      target: { element: document.body, keyUp: true },
      keyUpListener: mockEnter.keyup,
    };
    customRender(<ComponentRenderer config={config} />);

    userEvent.keyboard("${enter}");
    expect(mockEnter.keydown).not.toBeCalled();
    expect(mockEnter.keyup).toBeCalledWith(expect.objectContaining({ type: "keyup", keyCode: 36 }));
  });

  test("test listen with single key listener", () => {
    const config: Parameters<UseKeyboardType>[0] = {
      target: { element: document.body, keyDown: true, keyUp: true },
      keyDownListener: mockEnter.keydown,
      keyUpListener: mockEnter.keyup,
    };
    customRender(<ComponentRenderer config={config} />);

    pressEnterAndExpect();
  });
});

describe("Test multiple key", () => {
  test("exclude BEFORE_ALL and AFTER_ALL", () => {
    const config: Parameters<UseKeyboardType>[0] = {
      target: { element: document.body, keyDown: true, keyUp: true },
      keyDownListener: keydownListeners,
      keyUpListener: keyupListeners,
    };
    customRender(<ComponentRenderer config={config} />);

    pressEnterAndExpect();
    pressBackspaceAndExpect();
  });

  test("include BEFORE_ALL and AFTER_ALL", () => {
    const config: Parameters<UseKeyboardType>[0] = {
      target: { element: document.body, keyDown: true, keyUp: true },
      keyDownListener: { ...keydownListeners, ...keydownAllListeners },
      keyUpListener: { ...keyupListeners, ...keyupAllListeners },
    };
    customRender(<ComponentRenderer config={config} />);

    pressEnterAndExpect();
    expectBeforeAfterAll(13);

    pressBackspaceAndExpect();
    expectBeforeAfterAll(8);
  });
});
