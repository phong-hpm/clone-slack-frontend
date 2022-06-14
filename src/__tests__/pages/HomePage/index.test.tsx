import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import mockUseMediaQuery from "@mui/material/useMediaQuery";

// components
import HomePage from "pages/HomePage";
import HeroSection from "pages/HomePage/Sections/HeroSection";
import BranchesSection from "pages/HomePage/Sections/BranchesSection";
import BetterTomorrowSection from "pages/HomePage/Sections/BetterTomorrowSection";
import FeatureSection from "pages/HomePage/Sections/FeatureSection";
import WelcomeSection from "pages/HomePage/Sections/WelcomeSection";
import PeachSection from "pages/HomePage/Sections/PeachSection";

// hooks
import * as useYoutubeVideo from "hooks/useYoutubeVideo";

// utils
import { customRender } from "__tests__/__setups__";
import { routePaths } from "utils/constants";
import homepageConstants from "pages/HomePage/_homepage.constants";

describe("Render", () => {
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

  test("Render Peach section", () => {
    const mockNavigate = useNavigate();

    const peachData = homepageConstants.peachSection(mockNavigate);

    customRender(<PeachSection />);

    // test click "Create a new Slack workspace"
    userEvent.click(screen.getByText("Create a new Slack workspace"));
    expect(mockNavigate).toBeCalledWith(routePaths.SIGNUP_PAGE);

    // test steps
    expect(screen.getByText(peachData.title)).toBeInTheDocument();
    peachData.steps.forEach((step, index) => {
      expect(screen.getByText(`${index + 1}`)).toBeInTheDocument();
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });

    // test promotions
    peachData.promotions.forEach(({ title, subTitle }) => {
      // these data will be display in 2 group of code
      //   and these group of code will be displayed via css
      //   so [promotions] always render in the browser in 2 nodes
      expect(screen.getAllByText(title)).toHaveLength(2);
      expect(screen.getAllByText(subTitle)).toHaveLength(2);
    });
  });

  // coverage
  test("Render Peach section in medium screen", () => {
    (mockUseMediaQuery as jest.Mock).mockImplementation(() => true);
    customRender(<PeachSection />);
  });

  test("Render Welcome section", () => {
    const mockNavigate = useNavigate();
    customRender(<WelcomeSection />);

    expect(screen.getByText("Welcome to where the future works")).toBeInTheDocument();

    expect(mockNavigate).not.toBeCalled();
    userEvent.click(screen.getByRole("button", { name: "TRY FOR FREE" }));
    expect(mockNavigate).toBeCalledWith(routePaths.SIGNUP_PAGE);
  });
});
