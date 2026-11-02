"use client";
import dynamic from "next/dynamic";

const ScrollScene = dynamic(() => import("./ScrollScene"), { ssr: false, loading: () => <div className="h-screen" /> });

export default function ScrollSceneLoader() {
  return <ScrollScene />;
}
