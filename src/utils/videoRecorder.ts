// we should take thumbnails from blob:url
// if we pass a network url, it will take so much time to finish
/* istanbul ignore next */
// this function require runable [src] to test
// so we can't test it
export const createThumbnails = ({
  src,
  blob,
  limit = 5,
}: {
  src?: string;
  blob?: Blob;
  limit?: number;
}): Promise<string[]> => {
  const video = document.createElement("video");
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;

  return new Promise((resolve, reject) => {
    try {
      if (blob) video.src = URL.createObjectURL(new Blob([blob], { type: "video/webm" }));
      else if (src) video.src = src;
      else return resolve([]);

      let currentThumbnail = 0;
      const thumbnailUrls: string[] = [];

      // this handler will fix bug video.duration === Infinity
      video.onloadedmetadata = () => {
        if (video.duration === Infinity) {
          video.currentTime = 1e101;
          video.ontimeupdate = function () {
            this.ontimeupdate = () => {
              return;
            };
            video.currentTime = 0;
            return;
          };
        }
      };

      video.onerror = () => resolve([]);

      // will be fire after video loaded url with new currentTime
      video.oncanplay = () => {
        // the metadata is loaded after the Video. So the duration is not available
        if (video.duration === Infinity) return;

        c.width = video.videoWidth;
        c.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        c.toBlob((blob) => {
          // if video.currentTime is 0, thumbnail will be a empty picture, so ignore it
          if (video.currentTime && blob) thumbnailUrls.push(URL.createObjectURL(blob));

          // finish function
          if (currentThumbnail >= limit) resolve(thumbnailUrls);
          // set next currentTime, minimum is 1
          else video.currentTime = Math.ceil(currentThumbnail * (video.duration / limit)) || 1;

          currentThumbnail++;
        });
      };
    } catch {
      resolve([]);
    }
  });
};
