import { ReactNode } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./layout.css";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}
