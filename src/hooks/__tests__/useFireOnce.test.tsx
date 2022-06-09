import { useEffect, useState } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// hooks
import useFireOnce from "hooks/useFireOnce";

import { customRender } from "tests";

const ComponentRenderer = ({
  onFireOnce,
  onFireIdOnce,
  onNotFireOnce,
}: {
  onFireOnce: Function;
  onFireIdOnce: Function;
  onNotFireOnce: Function;
}) => {
  const { fireOnce, fireIdOnce } = useFireOnce();
  const [renderTimes, setRenderTimes] = useState(0);

  useEffect(() => {
    if (!renderTimes) return;
    onNotFireOnce();
    fireOnce(() => onFireOnce());
    // id will be changed when [renderTimes] is a even number
    const id = String(Math.floor(renderTimes / 2));
    fireIdOnce(id, () => onFireIdOnce());
  }, [renderTimes, onFireOnce, onFireIdOnce, onNotFireOnce]);

  return <div data-testid="trigger-render-times" onClick={() => setRenderTimes(renderTimes - 1)} />;
};

test("Test useFireOnce", () => {
  const mockFireOnce = jest.fn();
  const mockFireIdOnce = jest.fn();
  const mockNotFireOnce = jest.fn();
  customRender(
    <ComponentRenderer
      onFireOnce={mockFireOnce}
      onFireIdOnce={mockFireIdOnce}
      onNotFireOnce={mockNotFireOnce}
    />,
    {},
    false
  );

  // renderTimes = 1
  userEvent.click(screen.getByTestId("trigger-render-times"));
  expect(mockFireOnce).toBeCalledTimes(1);
  expect(mockFireIdOnce).toBeCalledTimes(1);
  expect(mockNotFireOnce).toBeCalledTimes(1);

  // renderTimes = 2
  userEvent.click(screen.getByTestId("trigger-render-times"));
  expect(mockFireOnce).toBeCalledTimes(1);
  expect(mockFireIdOnce).toBeCalledTimes(1);
  expect(mockNotFireOnce).toBeCalledTimes(2);

  // renderTimes = 3
  userEvent.click(screen.getByTestId("trigger-render-times"));
  expect(mockFireOnce).toBeCalledTimes(1);
  expect(mockFireIdOnce).toBeCalledTimes(2);
  expect(mockNotFireOnce).toBeCalledTimes(3);
});
