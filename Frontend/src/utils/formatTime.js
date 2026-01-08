export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const totalSeconds = Math.floor(seconds);

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const paddedMins = hrs > 0 ? String(mins).padStart(2, "0") : mins;
  const paddedSecs = String(secs).padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }

  return `${paddedMins}:${paddedSecs}`;
};
