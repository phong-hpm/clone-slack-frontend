import { NavigateFunction } from "react-router-dom";

// components
import { Link } from "@mui/material";

import { color, routePaths } from "utils/constants";

const heroSection = {
  title: "Slack is your digital HQ",
  desc: "Transform the way you work with one place for everyone and everything you need to get stuff done.",
};

const betterTomorrowSection = {
  title: "Now is your moment to build a better tomorrow",
  desc: "We've seen what the future can be. Now it's time to decide what it will be.",
};

const branchesSection = {
  branchList: ["fox", "lonelyplanet", "intuit", "carvana", "kiva", "target", "devacurl"],
};

const peachSection = (navigate: NavigateFunction) => {
  return {
    title: "Get started with Slack",
    steps: [
      {
        title: "Sign up",
        detail: (
          <>
            <Link color={color.SELECTED_ITEM} onClick={() => navigate(routePaths.SIGNUP_PAGE)}>
              Create a new Slack workspace
            </Link>{" "}
            in just a few moments. It's free to try for teams of any size.
          </>
        ),
      },
      {
        title: "Invite your coworkers",
        detail:
          "Slack is better together (no, really, it's a bit underwhelming by yourself), and it's easy to invite your team.",
      },
      {
        title: "Try it out",
        detail:
          "Run a project, coordinate with your team, or just talk it out. Slack is a blank canvas for teamwork.",
      },
    ],
    promotions: [
      {
        subTitle: "Webinar",
        title: "What is Slack?",
        action: "WATCH NOW",
        img: "promotion-01.jpeg",
      },
      {
        subTitle: "Customer Stories",
        title: "Get inspired by real Slack customers",
        action: "READ STORIES",
        img: "promotion-02.jpeg",
      },
      {
        subTitle: "Solutions",
        title: "Learn how Slack can work for your team",
        action: "EXPLORE SOLUTIONS",
        img: "promotion-03.jpeg",
      },
      {
        subTitle: "How-to",
        title: "Start off on the right foot with Slack 101",
        action: "LEARN HOW",
        img: "promotion-04.jpeg",
      },
    ],
  };
};

const featureSections = [
  {
    isReverse: false,
    title: "Move faster by organizing your work life",
    desc: "The key to productivity in Slack is organized spaces called channels—a different one for everything you're working on. With all the people, messages and files related to a topic in one place, you can move a whole lot faster.",
    linkText: "Learn more about channels",
    videoFile: "hp-01.mp4",
    videoList: [
      {
        youtubeId: "G1TYS5K7CqM",
        label: "What is a channel?",
        thumb: "what-are-channels.jpg",
        time: "0:15",
      },
      {
        youtubeId: "OhL2RNgS_cU",
        label: "How to create a channel",
        thumb: "brainstorm-in-a-channel.jpg",
        time: "0:15",
      },
    ],
  },
  {
    isReverse: true,
    title: "Focus your time, on your own terms",
    desc: "Give yourself the flexibility to work when, where and how you work best. Take control of notifications, collaborate live or on your own time, and find answers in conversations from across your company.",
    linkText: "Support a more flexible work schedule in Slack",
    videoFile: "hp-02.mp4",
    videoList: [
      {
        youtubeId: "e4z4kvK3n24",
        label: "How to pause notifications",
        thumb: "pause-notifications.jpg",
        time: "0:15",
      },
    ],
  },
  {
    isReverse: false,
    title: "Simplify teamwork for everyone",
    desc: "Give everyone you work with—inside and outside your company—a more productive way to stay in sync. Respond faster with emoji, keep conversations focused in channels, and simplify all your communication into one place.",
    linkText: "Learn how to work with external partners in Slack",
    videoFile: "hp-03.mp4",
    videoList: [
      {
        youtubeId: "G1TYS5K7CqM",
        label: "Work with external partners using Slack Connect",
        thumb: "add-external-partners-to-a-channel.jpg",
        time: "0:15",
      },
      {
        youtubeId: "OhL2RNgS_cU",
        label: "How to brainstorm in a channel",
        thumb: "brainstorm-in-a-channel.jpg",
        time: "0:15",
      },
    ],
  },
];

const welcomeSection = {
  title: "Welcome to where the future works",
};

const homepageConstants = {
  heroSection,
  betterTomorrowSection,
  branchesSection,
  peachSection,
  featureSections,
  welcomeSection,
};

export default homepageConstants;
