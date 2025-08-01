import Footer from '@/components/footer';
import GalleryContent from '@/components/gallery-content';
import Navbar from '@/components/navbar';

export default function Gallery() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <GalleryContent />
      <Footer />
    </div>
  );
}
