"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Knot({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.x = t * 0.25 + mouse.current.y * 0.4;
    m.rotation.y = t * 0.35 + mouse.current.x * 0.6;
    m.position.y = Math.sin(t * 0.8) * 0.15;
  });
  return (
    <mesh ref={ref} scale={1.25}>
      <torusKnotGeometry args={[1, 0.32, 220, 32]} />
      <meshPhysicalMaterial color="#7a3cff" metalness={0.75} roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} emissive="#2a0a5e" emissiveIntensity={0.4} />
    </mesh>
  );
}

function Orb({ pos, color, size, speed }: { pos: [number, number, number]; color: string; size: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime * speed;
    ref.current.position.set(pos[0] + Math.sin(t) * 0.35, pos[1] + Math.cos(t * 0.8) * 0.35, pos[2]);
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[size, 48, 48]} />
      <meshPhysicalMaterial color={color} metalness={0.3} roughness={0.1} clearcoat={1} emissive={color} emissiveIntensity={0.35} />
    </mesh>
  );
}

function Rings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * 0.15;
    ref.current.rotation.x = Math.PI / 2.6 + Math.sin(s.clock.elapsedTime * 0.3) * 0.1;
  });
  return (
    <group ref={ref}>
      <mesh><torusGeometry args={[2.4, 0.03, 16, 120]} /><meshBasicMaterial color="#2bd2ff" transparent opacity={0.7} /></mesh>
      <mesh><torusGeometry args={[2.9, 0.015, 16, 120]} /><meshBasicMaterial color="#ff3cac" transparent opacity={0.5} /></mesh>
    </group>
  );
}

function Particles() {
  const pts = useMemo(() => {
    const a = new Float32Array(400 * 3);
    for (let i = 0; i < a.length; i++) a[i] = (Math.random() - 0.5) * 12;
    return a;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.03; });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pts, 3]} /></bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

export default function Hero3D() {
  const mouse = useRef({ x: 0, y: 0 });
  return (
    <div
      className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouse.current = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
      }}
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-5, -3, 3]} intensity={30} color="#ff3cac" />
        <pointLight position={[5, -2, -3]} intensity={30} color="#2bd2ff" />
        <Knot mouse={mouse} />
        <Rings />
        <Orb pos={[-2.6, 1.4, -1]} color="#ff3cac" size={0.42} speed={0.9} />
        <Orb pos={[2.7, -1.2, -0.5]} color="#2bd2ff" size={0.34} speed={1.2} />
        <Orb pos={[2.2, 1.8, -2]} color="#ffb13b" size={0.26} speed={0.7} />
        <Orb pos={[-2.3, -1.7, -1.5]} color="#4dff9e" size={0.2} speed={1.5} />
        <Particles />
      </Canvas>
    </div>
  );
}
