import { ReactNode } from "react";
import { Header, Footer } from "./components";
import ThemeProvider from "@/ThemeProvider";
import "./layout.css";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="app-layout">
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
