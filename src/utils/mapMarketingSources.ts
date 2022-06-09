const videoExtensions = ["mp4"];

const mapMarketingSources = (file: string, page = "homepage") => {
  const [fileName, extension] = file.split(".");
  const type = videoExtensions.includes(extension) ? "video" : "image";
  const url = `${process.env.REACT_APP_SERVER_BASE_URL}/files/marketing/${page}/${type}/${fileName}`;

  const src = `${url}.${extension}`;
  if (type === "video") return { src };

  const srcSet = `${url}.${extension} 1x, ${url}@2x.${extension} 2x`;
  return { src, srcSet };
};

export default mapMarketingSources;
