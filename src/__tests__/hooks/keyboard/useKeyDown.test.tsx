import userEvent from "@testing-library/user-event";

// hooks
import useKeyDown from "hooks/keyboard/useKeyDown";

// utils
import { customRender } from "__tests__/__setups__";
import { eventKeys } from "utils/constants";

// this component will help us run codes in [useSocket]
const ComponentRenderer = ({ keys, onEnter }: { keys: string | string[]; onEnter: () => void }) => {
  useKeyDown(keys, onEnter);
  return <div></div>;
};

test("test press enter when callback is null", () => {
  customRender(
    <ComponentRenderer keys={eventKeys.KEY_ENTER} onEnter={null as unknown as () => void} />
  );

  userEvent.keyboard("${enter}");
  // expect that there is no exception
});

test("test listen single key", () => {
  const mockEnter = jest.fn();
  customRender(<ComponentRenderer keys={eventKeys.KEY_ENTER} onEnter={mockEnter} />);

  expect(mockEnter).not.toBeCalled();
  userEvent.keyboard("${enter}");
  expect(mockEnter).toBeCalledWith();
});

test("test listen multiple key", () => {
  const mockEnter = jest.fn();
  customRender(
    <ComponentRenderer keys={[eventKeys.KEY_ENTER, eventKeys.KEY_BACKSPACE]} onEnter={mockEnter} />
  );

  expect(mockEnter).not.toBeCalled();
  userEvent.keyboard("${enter}");
  expect(mockEnter).toBeCalledWith();
  mockEnter.mockClear();

  expect(mockEnter).not.toBeCalled();
  userEvent.keyboard("${backspace}");
  expect(mockEnter).toBeCalledWith();
});
