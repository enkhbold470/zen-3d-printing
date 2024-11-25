// import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import UploadFeature from "@/components/UploadFeature";
// import QuoteGenerator from "@/components/QuoteGenerator";
import GalleryOfServices from "@/components/GalleryOfServices";
import CustomerTestimonials from "@/components/CustomerTestimonials";
import About from "@/components/about-us";
import Contact from "@/components/contact";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <GalleryOfServices />
      <CustomerTestimonials />
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-8">
        <About />
        <Contact />
      </div>
    </main>
  );
}
