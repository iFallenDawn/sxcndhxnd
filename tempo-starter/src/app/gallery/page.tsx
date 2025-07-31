import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import GalleryContent from "@/components/gallery-content";

export default function Gallery() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <GalleryContent />
      <Footer />
    </div>
  );
}