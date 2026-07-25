export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-sm text-ink-faint">
        <span>© {new Date().getFullYear()} HireStone.</span>
        <span>Built for people doing the hiring and the job hunting.</span>
      </div>
    </footer>
  );
}
