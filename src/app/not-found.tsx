import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x py-32 text-center">
      <p className="font-display text-7xl font-bold gradient-text">404</p>
      <h1 className="font-display text-3xl font-bold mt-4">This page went viral and disappeared.</h1>
      <p className="text-muted mt-3">The page you are looking for does not exist. Try the blog or go home.</p>
      <div className="flex gap-3 justify-center mt-8">
        <Link href="/" className="btn btn-primary">Go home</Link>
        <Link href="/blog" className="btn btn-ghost">Read the blog</Link>
      </div>
    </section>
  );
}
