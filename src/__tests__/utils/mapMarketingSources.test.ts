import mapMarketingSources from "utils/mapMarketingSources";

test("mapMarketingSources", () => {
  const homepagePath = `${process.env.REACT_APP_SERVER_BASE_URL}/files/marketing/homepage`;

  expect(mapMarketingSources("img.png")).toEqual({
    src: `${homepagePath}/image/img.png`,
    srcSet: `${homepagePath}/image/img.png 1x, ` + `${homepagePath}/image/img@2x.png 2x`,
  });

  expect(mapMarketingSources("video.mp4")).toEqual({
    src: `${homepagePath}/video/video.mp4`,
  });
});
