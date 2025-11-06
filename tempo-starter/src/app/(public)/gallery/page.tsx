import GalleryContent from '@/components/gallery/gallery-content';
import NavbarWrapper from '@/components/layout/navbar/navbar-wrapper';
import { Box } from '@chakra-ui/react';

export default function Gallery() {
  return (
    <Box bg='white' minH='100vh'>
      <NavbarWrapper />
      <GalleryContent />
    </Box>
  );
}
