"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/diary", label: "Diary" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Jinxing
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                isActive(link.href)
                  ? "text-foreground font-medium"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-border" />
          {session ? (
            <div className="flex items-center gap-4">
              {!!(session as unknown as Record<string, unknown>)?.isAdmin && (
                <Link
                  href="/admin"
                  className={`text-sm transition-colors ${
                    isActive("/admin")
                      ? "text-foreground font-medium"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Admin
                </Link>
              )}
              <span className="text-sm text-muted">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm text-accent hover:text-accent-hover transition-colors font-medium"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted hover:text-foreground"
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 pb-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm transition-colors ${
                isActive(link.href)
                  ? "text-foreground font-medium"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {session ? (
            <>
              <span className="block py-2 text-sm text-muted">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="block py-2 text-sm text-muted hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-accent font-medium"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
