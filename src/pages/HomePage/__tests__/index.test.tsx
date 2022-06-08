import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

// components
import HomePage from "..";
import HeroSection from "../Sections/HeroSection";
import BranchesSection from "../Sections/BranchesSection";
import BetterTomorrowSection from "../Sections/BetterTomorrowSection";
import FeatureSection from "../Sections/FeatureSection";
import WelcomeSection from "../Sections/WelcomeSection";

// hooks
import * as useYoutubeVideo from "hooks/useYoutubeVideo";

// utils
import { customRender } from "tests";
import { routePaths } from "utils/constants";
import homepageConstants from "../_homepage.constants";

// jest can't import module [swiper], ignore this component to prevent error
jest.mock("../Sections/PeachSection", () => ({
  __esModule: true,
  default: () => <div>PeachSection</div>,
}));

test("Render Home page", () => {
  // mock for coverage
  jest
    .spyOn(useYoutubeVideo, "default")
    .mockImplementation(() => ({ isPlaying: true, play: () => {}, destroy: () => {} }));

  customRender(<HomePage />);

  expect(screen.getByText("Slack is your digital HQ")).toBeInTheDocument();
});

test("Render Hero section, click try for free button", () => {
  const mockNavigate = useNavigate();
  customRender(<HeroSection />);

  expect(screen.getByRole("img")).toBeInTheDocument();
  expect(screen.getByText("Slack is your digital HQ")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Transform the way you work with one place for everyone and everything you need to get stuff done."
    )
  ).toBeInTheDocument();
  expect(mockNavigate).not.toBeCalled();
  userEvent.click(screen.getByRole("button", { name: "TRY FOR FREE" }));
  expect(mockNavigate).toBeCalledWith(routePaths.SIGNUP_PAGE);
});

test("Render Branches section", () => {
  customRender(<BranchesSection />);

  expect(screen.getAllByRole("img")).toHaveLength(7);
});

test("Render Better Tomorrow section", () => {
  const onPlay = jest.fn();
  customRender(<BetterTomorrowSection onPlay={onPlay} />);

  userEvent.click(screen.getByRole("img"));
  expect(onPlay).toBeCalledWith("ZDs056YM4fc");
  onPlay.mockClear();

  userEvent.click(screen.getByRole("button", { name: "WATCH VIDEO" }));
  expect(onPlay).toBeCalledWith("ZDs056YM4fc");
});

test("Render Feature section", () => {
  const onPlay = jest.fn();
  const featureData = homepageConstants.featureSections[0];
  customRender(<FeatureSection {...featureData} onPlay={onPlay} />);

  expect(document.getElementsByTagName("video")).toHaveLength(1);

  userEvent.click(screen.getByText(featureData.videoList[0].label));
  expect(onPlay).toBeCalledWith("G1TYS5K7CqM");
});

test("Render Welcome section", () => {
  const mockNavigate = useNavigate();
  customRender(<WelcomeSection />);

  expect(screen.getByText("Welcome to where the future works")).toBeInTheDocument();

  expect(mockNavigate).not.toBeCalled();
  userEvent.click(screen.getByRole("button", { name: "TRY FOR FREE" }));
  expect(mockNavigate).toBeCalledWith(routePaths.SIGNUP_PAGE);
});
