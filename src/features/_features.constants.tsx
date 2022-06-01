import { routePaths } from "utils/constants";

import { SvgFileIconProps } from "components/SvgFileIcon";

const pageHeader = {
  navbarList: [
    { label: "Solutions", to: routePaths.SOLUTIONS_PAGE },
    { label: "Enterprise", to: routePaths.ENTERPRICE_PAGE },
    { label: "Resouces", to: routePaths.RESOURCES_PAGE },
    { label: "Pricing", to: routePaths.PRICING_PAGE },
  ],
  navbarProductList: [
    { label: "Features", to: routePaths.FEATURES_PAGE },
    { label: "Channels", to: routePaths.CHANNELS_PAGE },
    { label: "Digital HQ", to: routePaths.DIGITAL_HQ_PAGE },
    { label: "Intergrations", to: routePaths.INTERGRATIONS_PAGE },
    { label: "Security", to: routePaths.SECURITY_PAGE },
    { label: "Slack Connect", to: routePaths.SLACK_CONNECT_PAGE },
    { label: "Customers", to: routePaths.CUSTOMERS_PAGE },
  ],
};

const pageFooter = {
  navigationGroups: [
    {
      title: "WHY SLACK?",
      navigations: [
        { label: "Slack vs. Email", path: routePaths.SLACK_AND_EMAIL_PAGE },
        { label: "Channels", path: routePaths.CHANNELS_PAGE },
        { label: "Engagement", path: routePaths.ENGAGEMENT_PAGE },
        { label: "Scale", path: routePaths.SCALE_PAGE },
        { label: "Watch the Demo", path: routePaths.WATCH_THE_DEMO_PAGE },
      ],
    },
    {
      title: "PRODUCT",
      navigations: [
        { label: "Features", path: routePaths.FEATURES_PAGE },
        { label: "Integrations", path: routePaths.INTEGRATIONS_PAGE },
        { label: "Enterprise", path: routePaths.ENTERPRISE_PAGE },
        { label: "Solutions", path: routePaths.SOLUTIONS_PAGE },
      ],
    },
    {
      title: "PRICING",
      navigations: [
        { label: "Plans", path: routePaths.PLANS_PAGE },
        { label: "Paid vs. Free", path: routePaths.PAID_AND_FREE_PAGE },
      ],
    },
    {
      title: "RESOURCES",
      navigations: [
        { label: "Partners", path: routePaths.PARTNERS_PAGE },
        { label: "Developers", path: routePaths.DEVELOPERS_PAGE },
        { label: "Community", path: routePaths.COMMUNITY_PAGE },
        { label: "Apps", path: routePaths.APPS_PAGE },
        { label: "Blog", path: routePaths.BLOG_PAGE },
        { label: "Help Center", path: routePaths.HELP_CENTER_PAGE },
        { label: "Events", path: routePaths.EVENTS_PAGE },
      ],
    },
    {
      title: "COMPANY",
      navigations: [
        { label: "About Us", path: routePaths.ABOUT_US_PAGE },
        { label: "Leadership", path: routePaths.LEADERSHIP_PAGE },
        { label: "Investor Relations", path: routePaths.INVESTOR_RELATIONS_PAGE },
        { label: "News", path: routePaths.NEWS_PAGE },
        { label: "Media Kit", path: routePaths.MEDIA_KIT_PAGE },
        { label: "Careers", path: routePaths.CAREERS_PAGE },
      ],
    },
  ],
  signatures: {
    navigations: [
      { label: "Status", path: routePaths.STATUS_PAGE },
      { label: "Privacy", path: routePaths.PRIVACY_PAGE },
      { label: "Terms", path: routePaths.TERMS_PAGE },
      { label: "Cookie Preferences", path: routePaths.COOKIE_PREFERENCES_PAGE },
      { label: "Contact Us", path: routePaths.CONTACT_US_PAGE },
    ],
    metaSocials: [
      { icon: "twitter-black" as SvgFileIconProps["icon"], path: "https://twitter.com/slackhq" },
      {
        icon: "facebook-black" as SvgFileIconProps["icon"],
        path: "https://www.facebook.com/slackhq",
      },
      {
        icon: "youtube-black" as SvgFileIconProps["icon"],
        path: "https://www.youtube.com/channel/UCY3YECgeBcLCzIrFLP4gblw",
      },
      {
        icon: "linked-in-black" as SvgFileIconProps["icon"],
        path: "https://www.linkedin.com/company/tiny-spec-inc/",
      },
    ],
  },
};

const featuresConstants = {
  pageHeader,
  pageFooter,
};

export default featuresConstants;
