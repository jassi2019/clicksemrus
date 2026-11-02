/** Decorative CSS-3D shapes for section backgrounds. Purely visual. */
export function Sphere({ className = "", c1 = "#ff3cac", c2 = "#7a3cff", delay = 0 }: { className?: string; c1?: string; c2?: string; delay?: number }) {
  return <span aria-hidden="true" className={`shape sphere ${className}`} style={{ ["--c1" as string]: c1, ["--c2" as string]: c2, animationDelay: `${delay}s` }} />;
}
export function Ring({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return <span aria-hidden="true" className={`shape ring ${className}`} style={{ animationDelay: `${delay}s` }} />;
}
export function Pill({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return <span aria-hidden="true" className={`shape pill ${className}`} style={{ animationDelay: `${delay}s` }} />;
}
export function Cube({ className = "", size = 70 }: { className?: string; size?: number }) {
  const h = size / 2;
  const faces = [`rotateY(0deg) translateZ(${h}px)`, `rotateY(90deg) translateZ(${h}px)`, `rotateY(180deg) translateZ(${h}px)`, `rotateY(-90deg) translateZ(${h}px)`, `rotateX(90deg) translateZ(${h}px)`, `rotateX(-90deg) translateZ(${h}px)`];
  return (
    <span aria-hidden="true" className={`shape ${className}`} style={{ width: size, height: size, perspective: 600 }}>
      <span className="cube block relative" style={{ width: size, height: size }}>
        {faces.map((t, i) => <i key={i} style={{ transform: t }} />)}
      </span>
    </span>
  );
}
