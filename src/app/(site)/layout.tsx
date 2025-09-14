import Link from "next/link";
import { ReactNode } from "react";
import "./layout.css";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <header className="site-header">
        <div className="left">
          <Link href="/">Home</Link>
        </div>
        <div className="center">
          <input type="text" placeholder="Filter" />
        </div>
        <div className="right">
          <Link href="/login">Login</Link>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">Footer area</footer>
    </div>
  );
}
