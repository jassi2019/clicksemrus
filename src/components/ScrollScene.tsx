"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type P = React.MutableRefObject<number>;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Camera flies from z=9 to z=-6, passing through the ring at z=0. */
function Rig({ progress, mouse }: { progress: P; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = progress.current;
    const z = lerp(9, -6, p);
    camera.position.x = lerp(camera.position.x, mouse.current.x * 0.4, 0.05);
    camera.position.y = lerp(camera.position.y, -mouse.current.y * 0.3, 0.05);
    camera.position.z = lerp(camera.position.z, z, 0.08);
    camera.lookAt(0, 0, z - 10);
  });
  return null;
}

function Portal({ progress }: { progress: P }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * 0.2;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.4) * 0.15 + progress.current * 0.3;
    if (mat.current) mat.current.color.lerpColors(new THREE.Color("#ffffff"), new THREE.Color("#4f46e5"), range(progress.current, 0.2, 0.6));
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.3, 0.55, 64, 200]} />
      <meshPhysicalMaterial ref={mat} color="#ffffff" metalness={0.9} roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
    </mesh>
  );
}

function Inner({ progress }: { progress: P }) {
  const g = useRef<THREE.Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        pos: [(Math.random() - 0.5) * 7, (Math.random() - 0.5) * 5, -3 - Math.random() * 9] as [number, number, number],
        s: 0.18 + Math.random() * 0.32,
        kind: i % 3,
        rot: Math.random() * Math.PI,
      })),
    []
  );
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.y = s.clock.elapsedTime * 0.05;
    g.current.children.forEach((c, i) => {
      c.rotation.x = s.clock.elapsedTime * 0.3 + i;
      c.rotation.y = s.clock.elapsedTime * 0.2 + i;
      c.position.y = items[i].pos[1] + Math.sin(s.clock.elapsedTime + i) * 0.2;
    });
  });
  return (
    <group ref={g}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} rotation={[it.rot, it.rot, 0]} scale={it.s}>
          {it.kind === 0 ? <icosahedronGeometry args={[1, 0]} /> : it.kind === 1 ? <boxGeometry args={[1.2, 1.2, 1.2]} /> : <sphereGeometry args={[0.9, 32, 32]} />}
          <meshPhysicalMaterial color={i % 4 === 0 ? "#4f46e5" : "#f4f4f8"} metalness={0.6} roughness={0.2} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
}

function Particles() {
  const pts = useMemo(() => {
    const a = new Float32Array(500 * 3);
    for (let i = 0; i < a.length; i += 3) { a[i] = (Math.random() - 0.5) * 16; a[i + 1] = (Math.random() - 0.5) * 10; a[i + 2] = -14 + Math.random() * 24; }
    return a;
  }, []);
  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pts, 3]} /></bufferGeometry>
      <pointsMaterial size={0.035} color="#4f46e5" transparent opacity={0.5} />
    </points>
  );
}

const STAGES = [
  { from: 0.0, to: 0.28, eyebrow: "Digital Marketing Agency · Delhi NCR", title: ["Step inside", "real growth."], sub: "Scroll to enter. SEO, social, ads, content and websites, built around revenue." },
  { from: 0.34, to: 0.62, eyebrow: "What we do", title: ["Every channel.", "One funnel."], sub: "Search, social, paid media, content and conversion-focused websites, run by one accountable team." },
  { from: 0.68, to: 1.0, eyebrow: "Why ClickSemrus", title: ["Reports in rupees,", "not likes."], sub: "Live dashboards, weekly optimisation, and a trend desk that posts in 24 hours.", cta: true },
];

export default function ScrollScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [p, setP] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const v = clamp01(-r.top / total);
        progress.current = v;
        setP(v);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={wrap} className="relative h-[320vh] -mt-20" onPointerMove={(e) => { mouse.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 }; }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <div className="absolute inset-0 dots" />
        <div className="absolute inset-0" aria-hidden="true">
          {ready && (
            <Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={1.2} />
              <directionalLight position={[4, 6, 6]} intensity={2.2} />
              <pointLight position={[-6, -4, 2]} intensity={40} color="#4f46e5" />
              <pointLight position={[6, 2, -6]} intensity={30} color="#0ea5e9" />
              <Rig progress={progress} mouse={mouse} />
              <Portal progress={progress} />
              <Inner progress={progress} />
              <Particles />
            </Canvas>
          )}
        </div>

        {/* stage text overlays */}
        {STAGES.map((s, i) => {
          const o = i === 0 ? 1 - range(p, s.from + 0.1, s.to) : range(p, s.from, s.from + 0.08) * (1 - range(p, s.to - 0.06, s.to));
          const vis = i === STAGES.length - 1 ? range(p, s.from, s.from + 0.08) : o;
          return (
            <div key={i} className="absolute inset-0 flex items-center pointer-events-none" style={{ opacity: vis, transform: `translateY(${(1 - vis) * 24}px)` }}>
              <div className={`container-x ${i === 1 ? "text-right" : ""}`}>
                <div className={`max-w-xl ${i === 1 ? "ml-auto" : ""}`}>
                  <span className="eyebrow">{s.eyebrow}</span>
                  <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.98] mt-6">
                    {s.title[0]}<br /><span className="gradient-text">{s.title[1]}</span>
                  </h2>
                  <p className="text-muted text-lg md:text-xl mt-6 leading-relaxed">{s.sub}</p>
                  {s.cta && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 pointer-events-auto">
                      <Link href="/contact" className="btn btn-primary text-base !px-7 !py-4">Get a Free Growth Audit <ArrowRight size={18} /></Link>
                      <Link href="/case-studies" className="btn btn-ghost text-base !px-7 !py-4">See Results</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* scroll hint + progress */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 text-xs text-muted" style={{ opacity: 1 - range(p, 0, 0.1) }}>
          <span className="tracking-[.3em] uppercase">Scroll to enter</span>
          <span className="w-5 h-8 rounded-full border-2 border-current relative"><span className="absolute left-1/2 top-1.5 w-1 h-2 -ml-0.5 rounded bg-current animate-bounce" /></span>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3">
          {STAGES.map((s, i) => <span key={i} className="w-2 h-2 rounded-full transition-all" style={{ background: p >= s.from - 0.05 ? "#4f46e5" : "rgba(10,10,30,.2)", transform: p >= s.from - 0.05 && p < s.to ? "scale(1.5)" : "" }} />)}
        </div>
      </div>
    </div>
  );
}
