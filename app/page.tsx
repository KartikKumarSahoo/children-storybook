import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProductDemo from "@/components/ProductDemo";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductDemo />
      <Features />
      <HowItWorks />
      <Benefits />
    </main>
  );
}
