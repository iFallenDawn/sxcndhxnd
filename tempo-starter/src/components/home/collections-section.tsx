'use client';

import accessoriesImage from '@/assets/img/product-photos/accessories.jpg';
import bagImage from '@/assets/img/product-photos/bag.jpg';
import pantsImage from '@/assets/img/product-photos/pants.jpg';
import topImage from '@/assets/img/product-photos/top.jpg';
import {
  Box,
  chakra,
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  shouldForwardProp,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { isValidMotionProp, motion, useScroll, useTransform } from 'framer-motion';
import { Scissors, Shirt, ShoppingBag, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

// Create motion components with Chakra UI
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const ChakraGridItem = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

// Collection data with earthy color assignments
const collections = [
  {
    id: 1,
    name: 'Tops',
    description: 'Upcycled shirts, blouses & jackets',
    tagline: 'RECONSTRUCTED',
    image: topImage,
    href: '/store?category=tops',
    icon: Shirt,
    color: 'blue', // Denim blue
    colorValue: { light: 'blue.700', dark: 'blue.600' },
  },
  {
    id: 2,
    name: 'Bottoms',
    description: 'Reconstructed pants, skirts & shorts',
    tagline: 'REWORKED',
    image: pantsImage,
    href: '/store?category=bottoms',
    icon: Scissors,
    color: 'orange', // Leather brown
    colorValue: { light: 'orange.800', dark: 'orange.700' },
  },
  {
    id: 3,
    name: 'Tote Bags',
    description: 'Handmade from reclaimed materials',
    tagline: 'HANDCRAFTED',
    image: bagImage,
    href: '/store?category=tote-bags',
    icon: ShoppingBag,
    color: 'green', // Dark plaid green
    colorValue: { light: 'green.800', dark: 'green.700' },
  },
  {
    id: 4,
    name: 'Accessories',
    description: 'Belts, scarves & unique pieces',
    tagline: 'ONE-OF-A-KIND',
    image: accessoriesImage,
    href: '/store?category=accessories',
    icon: Tag,
    color: 'gray', // Charcoal gray
    colorValue: { light: 'gray.700', dark: 'gray.600' },
  },
];

export default function CollectionsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

  // Dynamic color values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'blackAlpha.600');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      ref={containerRef}
      position='relative'
      minH={{ base: '100vh', md: '100vh', lg: '100vh' }}
      h={{ base: 'auto', md: 'auto', lg: '100vh' }}
      bg={bgColor}
      overflow='hidden'
      py={{ base: 16, md: 24, lg: 12 }}
      display={{ base: 'block', md: 'block', lg: 'flex' }}
      alignItems={{ lg: 'center' }}>
      {/* Subtle fabric texture pattern background */}
      <Box
        position='absolute'
        inset={0}
        opacity={0.03}
        backgroundImage={`
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            ${useColorModeValue('gray.800', 'gray.100')} 2px,
            ${useColorModeValue('gray.800', 'gray.100')} 4px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${useColorModeValue('gray.800', 'gray.100')} 2px,
            ${useColorModeValue('gray.800', 'gray.100')} 4px
          )
        `}
        backgroundSize='40px 40px'
      />

      {/* Diagonal stripe pattern overlay */}
      <Box
        position='absolute'
        inset={0}
        backgroundImage='repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 50px,
          rgba(0, 0, 0, 0.01) 50px,
          rgba(0, 0, 0, 0.01) 100px
        )'
        mixBlendMode='multiply'
      />

      <Container
        maxW='7xl'
        position='relative'
        zIndex={1}
        h={{ base: 'auto', md: 'auto', lg: '100%' }}
        display={{ base: 'block', md: 'block', lg: 'flex' }}
        alignItems={{ lg: 'center' }}
        py={{ base: 0, md: 0, lg: 8 }}>
        <VStack
          spacing={{ base: 12, md: 16, lg: 8 }}
          width='full'
          h={{ base: 'auto', md: 'auto', lg: '100%' }}
          justify={{ lg: 'center' }}>
          {/* Header with thin/bold contrast typography */}
          <ChakraBox
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            // @ts-ignore - Motion transition type conflict with Chakra
            transition={{ duration: 0.8, ease: [0.21, 1.04, 0.58, 1] }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ opacity, scale }}
            textAlign='center'
            width='full'>
            <Heading
              as='h2'
              fontSize={{ base: '4xl', sm: '5xl', md: '6xl', lg: '6xl' }}
              fontWeight='700'
              textTransform='uppercase'
              lineHeight='1'
              color={textColor}
              letterSpacing='-0.04em'>
              <Box
                as='span'
                display='inline'
                bgGradient={useColorModeValue(
                  'linear(to-r, blue.700, green.800, orange.800)',
                  'linear(to-r, blue.600, green.700, orange.700)'
                )}
                bgClip='text'>
                COLLECTIONS
              </Box>
            </Heading>

            <Text
              fontSize={{ base: 'lg', md: 'xl', lg: 'lg', xl: 'xl' }}
              color={mutedTextColor}
              maxW='600px'
              mx='auto'
              mt={{ base: 4, md: 5, lg: 4 }}
              fontWeight='300'
              letterSpacing='0.02em'>
              Each piece tells a story of transformation
            </Text>
          </ChakraBox>

          {/* Asymmetrical staggered grid layout */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={{ base: 6, md: 8, lg: 6, xl: 8 }}
            width='full'
            maxW={{ base: '6xl', lg: '100%' }}
            flex={{ lg: 1 }}
            alignContent={{ lg: 'center' }}>
            {collections.map((collection, index) => {
              const isEven = index % 2 === 0;
              const colorValue = useColorModeValue(
                collection.colorValue.light,
                collection.colorValue.dark
              );

              return (
                <ChakraGridItem
                  key={collection.id}
                  gridColumn={{
                    base: '1 / -1',
                    md: isEven
                      ? index === 0 ? 'span 7' : 'span 5'
                      : index === 1 ? 'span 5' : 'span 7',
                    lg: 'span 1'
                  }}
                  initial={{ opacity: 0, y: 40, rotate: isEven ? -2 : 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  // @ts-ignore - Motion transition type conflict with Chakra
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.21, 1.04, 0.58, 1],
                  }}
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredId(collection.id)}
                  onHoverEnd={() => setHoveredId(null)}>
                  <Link href={collection.href}>
                    <Box
                      position='relative'
                      height={{
                        base: '300px',
                        md: index < 2 ? '450px' : '400px',
                        lg: 'calc(65vh)',
                        xl: 'calc(70vh)'
                      }}
                      overflow='hidden'
                      bg={cardBg}
                      border='2px solid'
                      borderColor={borderColor}
                      transition='all 0.4s cubic-bezier(0.23, 1, 0.320, 1)'
                      _hover={{
                        borderColor: colorValue,
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px -10px ${colorValue}33`,
                      }}>
                      {/* Image container with scale animation */}
                      <Box
                        position='absolute'
                        inset={0}
                        overflow='hidden'>
                        <ChakraBox
                          position='relative'
                          width='full'
                          height='full'
                          animate={{
                            scale: hoveredId === collection.id ? 1.08 : 1,
                          }}
                          // @ts-ignore
                          transition={{ duration: 0.6, ease: [0.23, 1, 0.320, 1] }}>
                          <Image
                            src={collection.image}
                            alt={collection.name}
                            fill
                            className='object-cover'
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                            priority={index < 2}
                          />
                        </ChakraBox>

                        {/* Gradient overlay */}
                        <Box
                          position='absolute'
                          inset={0}
                          bgGradient={`linear(to-b, transparent 40%, ${colorValue}CC)`}
                          opacity={hoveredId === collection.id ? 0.9 : 0.7}
                          transition='opacity 0.4s'
                        />
                      </Box>

                      {/* Content overlay */}
                      <Box
                        position='absolute'
                        bottom={0}
                        left={0}
                        right={0}
                        p={{ base: 6, md: 8, lg: 6, xl: 8 }}
                        color='white'>
                        {/* Small tagline */}
                        <Text
                          fontSize='xs'
                          fontWeight='700'
                          textTransform='uppercase'
                          letterSpacing='0.15em'
                          mb={2}
                          opacity={0.9}>
                          {collection.tagline}
                        </Text>

                        {/* Collection name with icon */}
                        <Box
                          display='flex'
                          alignItems='center'
                          gap={3}
                          mb={3}>
                          <Icon
                            as={collection.icon}
                            w={5}
                            h={5}
                            color='white'
                            opacity={hoveredId === collection.id ? 1 : 0}
                            transform={hoveredId === collection.id ? 'rotate(0deg)' : 'rotate(-90deg)'}
                            transition='all 0.4s'
                          />
                          <Heading
                            as='h3'
                            fontSize={{ base: '2xl', md: '3xl', lg: '2xl', xl: '3xl' }}
                            fontWeight='700'
                            textTransform='uppercase'
                            letterSpacing='-0.02em'>
                            {collection.name}
                          </Heading>
                        </Box>

                        {/* Description */}
                        <Text
                          fontSize={{ base: 'sm', md: 'md' }}
                          opacity={0.95}
                          fontWeight='300'>
                          {collection.description}
                        </Text>

                        {/* Subtle corner accent */}
                        <Box
                          position='absolute'
                          top={0}
                          right={0}
                          width='60px'
                          height='60px'
                          borderTop='3px solid'
                          borderRight='3px solid'
                          borderColor={colorValue}
                          opacity={hoveredId === collection.id ? 1 : 0}
                          transform={hoveredId === collection.id ? 'scale(1)' : 'scale(0.7)'}
                          transformOrigin='top right'
                          transition='all 0.4s'
                        />

                        {/* Bottom accent bar */}
                        <Box
                          position='absolute'
                          bottom={0}
                          left={0}
                          right={0}
                          height='3px'
                          bg={colorValue}
                          transform={hoveredId === collection.id ? 'scaleX(1)' : 'scaleX(0)'}
                          transformOrigin='left'
                          transition='transform 0.4s cubic-bezier(0.23, 1, 0.320, 1)'
                        />
                      </Box>
                    </Box>
                  </Link>
                </ChakraGridItem>
              );
            })}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}