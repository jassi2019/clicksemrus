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
const ease = (t: number) => t * t * (3 - 2 * t);

/** Camera: starts in front of the sphere, flies through the exploded particle field. */
function Rig({ progress, mouse, mobile }: { progress: P; mouse: React.MutableRefObject<{ x: number; y: number }>; mobile: boolean }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = progress.current;
    const z = lerp(mobile ? 10 : 8, -9, ease(p));
    const tx = mobile ? 0 : lerp(1.6, 0, range(p, 0.6, 0.9)) + mouse.current.x * 0.3;
    const ty = mobile ? lerp(1.4, 0, range(p, 0, 0.4)) : -mouse.current.y * 0.25;
    camera.position.x = lerp(camera.position.x, tx, 0.06);
    camera.position.y = lerp(camera.position.y, ty, 0.06);
    camera.position.z = lerp(camera.position.z, z, 0.08);
    camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, z - 12);
  });
  return null;
}

/** 700 glossy micro-spheres packed into a ball that bursts outward as you scroll. */
function ParticleSphere({ progress, count }: { progress: P; count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    const arr: { dir: THREE.Vector3; r: number; s: number; spin: number }[] = [];
    for (let i = 0; i < count; i++) {
      // fibonacci sphere distribution
      const y = 1 - (i / (count - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = Math.PI * (3 - Math.sqrt(5)) * i;
      const dir = new THREE.Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad);
      arr.push({ dir, r: 1.9 + Math.random() * 0.25, s: 0.06 + Math.random() * 0.09, spin: Math.random() * Math.PI * 2 });
    }
    return arr;
  }, [count]);
  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    const a = new THREE.Color("#ffffff"), b = new THREE.Color("#4f46e5"), d = new THREE.Color("#0b0b14");
    for (let i = 0; i < count; i++) {
      const pick = Math.random();
      const col = pick < 0.68 ? a : pick < 0.92 ? b : d;
      c.set([col.r, col.g, col.b], i * 3);
    }
    return c;
  }, [count]);

  useFrame((s) => {
    const m = ref.current;
    if (!m) return;
    const t = s.clock.elapsedTime;
    const p = progress.current;
    const burst = ease(range(p, 0.12, 0.75)); // 0 = packed sphere, 1 = fully exploded
    m.rotation.y = t * 0.12 + p * 1.2;
    m.rotation.x = Math.sin(t * 0.2) * 0.1;
    for (let i = 0; i < count; i++) {
      const d = data[i];
      const radius = d.r + burst * (6 + (i % 7)) + Math.sin(t * 0.8 + d.spin) * 0.05;
      dummy.position.copy(d.dir).multiplyScalar(radius);
      // spread along z so the camera flies "through" them
      dummy.position.z += burst * ((i % 11) - 5) * 1.2;
      const sc = d.s * (1 + burst * 1.8);
      dummy.scale.setScalar(sc);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </sphereGeometry>
      <meshPhysicalMaterial vertexColors metalness={0.55} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
    </instancedMesh>
  );
}

/** Glossy core that shrinks as the shell bursts, then a second glowing core appears deep inside. */
function Core({ progress }: { progress: P }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const p = progress.current;
    const t = s.clock.elapsedTime;
    if (a.current) {
      const sc = lerp(1.5, 0.001, ease(range(p, 0.2, 0.55)));
      a.current.scale.setScalar(sc);
      a.current.rotation.y = t * 0.3;
    }
    if (b.current) {
      const sc = lerp(0.001, 2.2, ease(range(p, 0.7, 1)));
      b.current.scale.setScalar(sc);
      b.current.rotation.y = -t * 0.2;
      b.current.rotation.x = t * 0.15;
    }
  });
  return (
    <>
      <mesh ref={a}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial color="#0b0b14" metalness={1} roughness={0.08} clearcoat={1} />
      </mesh>
      <mesh ref={b} position={[0, 0, -16]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial color="#4f46e5" metalness={0.4} roughness={0.2} clearcoat={1} flatShading />
      </mesh>
    </>
  );
}

const STAGES = [
  { from: 0.0, to: 0.26, eyebrow: "Digital Marketing Agency · Delhi NCR", title: ["Make your brand", "impossible to ignore."], sub: "SEO, social, ads, content and websites, built around one number: revenue. Scroll to see how." },
  { from: 0.34, to: 0.62, eyebrow: "What we do", title: ["Every channel.", "One funnel."], sub: "Search, social, paid media, content and conversion-focused websites, run by one accountable team." },
  { from: 0.70, to: 1.0, eyebrow: "Why ClickSemrus", title: ["Reports in rupees,", "not likes."], sub: "Live dashboards, weekly optimisation, and a trend desk that posts within 24 hours.", cta: true },
];

export default function ScrollScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [p, setP] = useState(0);
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(window.innerWidth < 768);
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
    const onResize = () => { setMobile(window.innerWidth < 768); onScroll(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={wrap}
      className="relative h-[260vh] md:h-[320vh] -mt-20"
      onPointerMove={(e) => { if (!mobile) mouse.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 }; }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-white">
        <div className="absolute inset-0 dots" />
        <div className="absolute inset-0" aria-hidden="true">
          {ready && (
            <Canvas camera={{ position: [1.6, 0, 8], fov: mobile ? 60 : 50 }} dpr={[1, mobile ? 1.5 : 2]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
              <ambientLight intensity={1.1} />
              <directionalLight position={[5, 6, 6]} intensity={2.4} />
              <pointLight position={[-6, -3, 3]} intensity={50} color="#4f46e5" />
              <pointLight position={[6, 3, -8]} intensity={40} color="#0ea5e9" />
              <Rig progress={progress} mouse={mouse} mobile={mobile} />
              <ParticleSphere progress={progress} count={mobile ? 380 : 720} />
              <Core progress={progress} />
            </Canvas>
          )}
        </div>

        {/* stage text overlays */}
        {STAGES.map((s, i) => {
          const fadeIn = i === 0 ? 1 : range(p, s.from, s.from + 0.07);
          const fadeOut = i === STAGES.length - 1 ? 1 : 1 - range(p, s.to - 0.07, s.to);
          const vis = Math.min(fadeIn, fadeOut);
          if (vis <= 0.001) return null;
          return (
            <div key={i} className="absolute inset-0 flex items-end md:items-center pb-24 md:pb-0 pointer-events-none" style={{ opacity: vis, transform: `translateY(${(1 - vis) * 20}px)` }}>
              <div className="container-x">
                <div className={`max-w-xl relative ${i === 1 ? "md:ml-auto" : ""}`}>
                  <div className="absolute -inset-6 md:-inset-10 rounded-[2rem] bg-white/85 md:bg-white/70 blur-xl -z-10" />
                  <span className="eyebrow">{s.eyebrow}</span>
                  <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1] mt-5">
                    {s.title[0]}<br /><span className="gradient-text">{s.title[1]}</span>
                  </h2>
                  <p className="text-muted text-base md:text-xl mt-4 md:mt-6 leading-relaxed">{s.sub}</p>
                  {s.cta && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8 pointer-events-auto">
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
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2 text-[11px] text-muted" style={{ opacity: 1 - range(p, 0, 0.08) }}>
          <span className="tracking-[.3em] uppercase">Scroll</span>
          <span className="w-5 h-8 rounded-full border-2 border-current relative"><span className="absolute left-1/2 top-1.5 w-1 h-2 -ml-0.5 rounded bg-current animate-bounce" /></span>
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3">
          {STAGES.map((s, i) => <span key={i} className="w-2 h-2 rounded-full transition-all" style={{ background: p >= s.from - 0.05 ? "#4f46e5" : "rgba(10,10,30,.2)", transform: p >= s.from - 0.05 && p < s.to ? "scale(1.5)" : "" }} />)}
        </div>
      </div>
    </div>
  );
}
