import SimpleFooter from '@/components/simple-footer';
import GalleryContent from '@/components/gallery-content';
import NavbarWrapper from '@/components/navbar-wrapper';

export default function Gallery() {
  return (
    <div className='min-h-screen bg-white'>
      <NavbarWrapper />
      <GalleryContent />
      <SimpleFooter />
    </div>
  );
}
