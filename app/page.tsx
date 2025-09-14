import Benefits from "@/components/Benefits";
import ExampleGallery from "@/components/ExampleGallery";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProductDemo from "@/components/ProductDemo";
import SecondaryCTA from "@/components/SecondaryCTA";

export default function Home() {
  return (
    <main>
      <Header />
      <section id="hero">
        <Hero />
      </section>
      <section id="demo">
        <ProductDemo />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="benefits">
        <Benefits />
      </section>
      <section id="examples">
        <ExampleGallery />
      </section>
      <SecondaryCTA />
      <Footer />
    </main>
  );
}
