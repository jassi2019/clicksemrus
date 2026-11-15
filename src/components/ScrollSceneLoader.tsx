"use client";
import GrowthStoryHero, { type HeroReel } from "./GrowthStoryHero";
import { HERO_DEFAULT, type HeroContent } from "./HeroStatic";

/** Homepage hero: the growth-story board (CSS/SVG, no WebGL). Kept under the old name so the page import is unchanged. */
export default function ScrollSceneLoader({ hero = HERO_DEFAULT, reel }: { hero?: HeroContent; reel?: HeroReel | null }) {
  return <GrowthStoryHero hero={hero} reel={reel} />;
}
