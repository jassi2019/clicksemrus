/** Decorative CSS-3D shapes for section backgrounds. Purely visual, hidden on small screens. */
const base = "shape hidden md:block";

export function Sphere({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return <span aria-hidden="true" className={`${base} sphere ${className}`} style={{ animationDelay: `${delay}s` }} />;
}
export function Ring({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return <span aria-hidden="true" className={`${base} ring ${className}`} style={{ animationDelay: `${delay}s` }} />;
}
export function Pill({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return <span aria-hidden="true" className={`${base} pill ${className}`} style={{ animationDelay: `${delay}s` }} />;
}
export function Cube({ className = "", size = 70 }: { className?: string; size?: number }) {
  const h = size / 2;
  const faces = [`rotateY(0deg) translateZ(${h}px)`, `rotateY(90deg) translateZ(${h}px)`, `rotateY(180deg) translateZ(${h}px)`, `rotateY(-90deg) translateZ(${h}px)`, `rotateX(90deg) translateZ(${h}px)`, `rotateX(-90deg) translateZ(${h}px)`];
  return (
    <span aria-hidden="true" className={`${base} ${className}`} style={{ width: size, height: size, perspective: 600 }}>
      <span className="cube block relative" style={{ width: size, height: size }}>
        {faces.map((t, i) => <i key={i} style={{ transform: t }} />)}
      </span>
    </span>
  );
}
