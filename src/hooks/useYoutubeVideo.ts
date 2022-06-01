import { useRef, useState } from "react";

const useYoutubeVideo = (elementId: string) => {
  const keepRef = useRef<{
    ytPlayer?: any;
    playingId: string;
    currentTimes: Record<string, number>;
  }>({
    playingId: "",
    currentTimes: {},
  });

  const [isPlaying, setPlaying] = useState(false);

  const play = (id: string) => {
    const YT = (window as any).YT;
    if (!YT) return;

    const playerElement = document.getElementById(elementId);
    if (!playerElement) return;
    playerElement.style.width = "100%";

    keepRef.current.ytPlayer = new YT.Player(elementId, {
      height: "100%",
      width: "100%",
      videoId: id,
      playerVars: { playsinline: 1, start: Math.floor(keepRef.current.currentTimes[id]) },
      events: {
        onReady: (event: any) => {
          keepRef.current.playingId = id;
          event.target.playVideo();
          setPlaying(true);
        },
      },
    });
  };

  const destroy = () => {
    keepRef.current.currentTimes[keepRef.current.playingId] =
      keepRef.current.ytPlayer?.getCurrentTime();
    keepRef.current.playingId = "";
    keepRef.current.ytPlayer?.destroy();
    setPlaying(false);
  };

  return { isPlaying, play, destroy };
};

export default useYoutubeVideo;
