import { Header } from "@/components/Header";
import { Hero } from "@/components/Landing/Hero";
import { Features } from "@/components/Landing/Features";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Header />
      <Hero />
      <Features />
    </main>
  );
}
