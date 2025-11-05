import GalleryContent from '@/components/gallery/gallery-content';
import NavbarWrapper from '@/components/layout/navbar/navbar-wrapper';

export default function Gallery() {
  return (
    <div className='bg-white'>
      <NavbarWrapper />
      <GalleryContent />
    </div>
  );
}
