import Benefits from "@/components/Benefits";
import ExampleGallery from "@/components/ExampleGallery";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProductDemo from "@/components/ProductDemo";
import SecondaryCTA from "@/components/SecondaryCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductDemo />
      <Features />
      <HowItWorks />
      <Benefits />
      <ExampleGallery />
      <SecondaryCTA />
      <Footer />
    </main>
  );
}
