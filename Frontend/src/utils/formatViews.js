export const formatViews = (views) => {
  if (views === null || views === undefined) return "0 views";

  const num = Number(views);

  if (num < 1000) {
    return `${num} views`;
  }

  if (num < 1_000_000) {
    return `${(num / 1000).toFixed(1).replace(".0", "")}K views`;
  }

  if (num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(".0", "")}M views`;
  }

  return `${(num / 1_000_000_000).toFixed(1).replace(".0", "")}B views`;
};
