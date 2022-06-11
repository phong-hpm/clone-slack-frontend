import { screen } from "@testing-library/react";

// components
import TimeCard from "components/TimeCard";

// utils
import { customRender } from "tests";
import { dayFormat } from "utils/dayjs";

describe("Test render", () => {
  const day = new Date("11/11/2021");
  day.setHours(9);
  day.setMinutes(45);
  day.setSeconds(30);

  test("When use default format", () => {
    customRender(<TimeCard time={day.getTime()} />);

    expect(screen.getByText("9:45")).toBeInTheDocument();
  });

  test("When use specific format", () => {
    customRender(
      <TimeCard time={day.getTime()} formatFn={(time: number) => dayFormat(time, "hh:mm:ss")} />
    );

    expect(screen.getByText("09:45:30")).toBeInTheDocument();
  });
});
