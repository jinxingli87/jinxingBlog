export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Jinxing Blog. All rights reserved.
        </p>
        <p className="text-sm text-muted">
          Thoughts on AI, technology &amp; life.
        </p>
      </div>
    </footer>
  );
}
