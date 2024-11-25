// import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import UploadFeature from "@/components/UploadFeature";
// import QuoteGenerator from "@/components/QuoteGenerator";
import GalleryOfServices from "@/components/GalleryOfServices";
import CustomerTestimonials from "@/components/CustomerTestimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* <Header /> */}
      <HeroSection />
      {/* <UploadFeature /> */}
      {/* <QuoteGenerator /> */}
      <GalleryOfServices />
      <CustomerTestimonials />
    </main>
  );
}
