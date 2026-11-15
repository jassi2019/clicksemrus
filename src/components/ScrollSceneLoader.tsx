"use client";
import GrowthStoryHero from "./GrowthStoryHero";
import { HERO_DEFAULT, type HeroContent } from "./HeroStatic";

/** Homepage hero: the growth-story board (CSS/SVG, no WebGL). Kept under the old name so the page import is unchanged. */
export default function ScrollSceneLoader({ hero = HERO_DEFAULT }: { hero?: HeroContent }) {
  return <GrowthStoryHero hero={hero} />;
}
