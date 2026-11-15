import type { Reel } from "@/lib/reels";

/**
 * Reels we produced, hosted on this site (public/reels) so they play natively in the showcase.
 * Add a file pair rN.mp4 + rN.jpg in public/reels and bump COUNT. Links always go to our own Instagram.
 */
const COUNT = 14;

export const LOCAL_REELS: Reel[] = Array.from({ length: COUNT }, (_, i) => {
  const n = i + 1;
  return {
    code: `local-r${n}`,
    url: "https://www.instagram.com/clicksemrus/",
    thumb: `/reels/r${n}.jpg`,
    video: `/reels/r${n}.mp4`,
    caption: "Brand reel produced by ClickSemrus",
    likes: 0,
    comments: 0,
    timestamp: "2026-11-16T00:00:00Z",
  };
});
