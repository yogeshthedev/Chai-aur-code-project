import { useState, useEffect, useRef, useCallback } from "react";

export const formatTime = (timeInSeconds = 0) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }
  return `${minutes}:${formattedSeconds}`;
};

export const useVideoPlayer = ({ videoRef, containerRef, autoPlay = true, onVideoEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [flashAction, setFlashAction] = useState(null);

  const controlsTimeoutRef = useRef(null);
  const flashTimeoutRef = useRef(null);

  const triggerFlash = (action) => {
    setFlashAction(action);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => {
      setFlashAction(null);
    }, 600);
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch(() => {});
      setIsPlaying(true);
      triggerFlash("play");
    } else {
      video.pause();
      setIsPlaying(false);
      triggerFlash("pause");
    }
  }, [videoRef]);

  const seek = useCallback((timeInSeconds) => {
    const video = videoRef.current;
    if (!video) return;
    const clampedTime = Math.max(0, Math.min(timeInSeconds, video.duration || 0));
    video.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, [videoRef]);

  const seekRelative = useCallback((deltaSeconds) => {
    const video = videoRef.current;
    if (!video) return;
    const target = video.currentTime + deltaSeconds;
    seek(target);
    triggerFlash(deltaSeconds > 0 ? "forward" : "rewind");
  }, [videoRef, seek]);

  const setVolume = useCallback((val) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = Math.max(0, Math.min(1, val));
    video.volume = newVol;
    setVolumeState(newVol);
    if (newVol === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (video.muted) {
      video.muted = false;
      setIsMuted(false);
    }
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && video.volume === 0) {
      video.volume = 0.5;
      setVolumeState(0.5);
    }
  }, [videoRef]);

  const setPlaybackRate = useCallback((rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRateState(rate);
  }, [videoRef]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, [containerRef]);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !document.pictureInPictureEnabled) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch {
      // ignore
    }
  }, [videoRef]);

  const toggleLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextLoop = !video.loop;
    video.loop = nextLoop;
    setIsLooping(nextLoop);
  }, [videoRef]);

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode((prev) => !prev);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2800);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration || 1;
        setBufferedPercent((bufferedEnd / duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setVolumeState(video.volume);
      setIsMuted(video.muted);
      if (autoPlay) {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onEnded = () => {
      setIsPlaying(false);
      if (onVideoEnd) onVideoEnd();
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
    };
  }, [videoRef, autoPlay, onVideoEnd]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["INPUT", "TEXTAREA"].includes(e.target.tagName) ||
        e.target.isContentEditable
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "j":
          e.preventDefault();
          seekRelative(-10);
          break;
        case "l":
          e.preventDefault();
          seekRelative(10);
          break;
        case "arrowleft":
          e.preventDefault();
          seekRelative(-5);
          break;
        case "arrowright":
          e.preventDefault();
          seekRelative(5);
          break;
        case "arrowup":
          e.preventDefault();
          setVolume(volume + 0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          setVolume(volume - 0.1);
          break;
        case "t":
          e.preventDefault();
          toggleTheaterMode();
          break;
        case "p":
          e.preventDefault();
          togglePiP();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay, toggleFullscreen, toggleMute, seekRelative, setVolume, volume, toggleTheaterMode, togglePiP]);

  return {
    isPlaying,
    currentTime,
    duration,
    bufferedPercent,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    isPiP,
    isLooping,
    isTheaterMode,
    showControls,
    isBuffering,
    flashAction,
    togglePlay,
    seek,
    seekRelative,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    togglePiP,
    toggleLoop,
    toggleTheaterMode,
    handleMouseMove,
    setShowControls,
  };
};
