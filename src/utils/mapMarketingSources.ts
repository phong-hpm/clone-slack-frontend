const videoExtensions = ["mp4"];

const mapMarketingSources = (file: string, page = "homepage") => {
  const [fileName, extension] = file.split(".");
  const type = videoExtensions.includes(extension) ? "video" : "image";
  const url = `http://localhost:8000/files/marketing/${page}/${type}/${fileName}`;

  const src = `${url}.${extension}`;
  if (type === "video") return { src };

  const srcSet = `${url}.${extension} 1x, ${url}@2x.${extension} 2x`;
  return { src, srcSet };
};

export default mapMarketingSources;
