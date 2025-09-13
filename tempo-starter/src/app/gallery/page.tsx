import SimpleFooter from '@/components/layout/footer/simple-footer';
import GalleryContent from '@/components/gallery/gallery-content';
import NavbarWrapper from '@/components/layout/navbar/navbar-wrapper';

export default function Gallery() {
  return (
    <div className='min-h-screen bg-white'>
      <NavbarWrapper />
      <GalleryContent />
      <SimpleFooter />
    </div>
  );
}
