'use client';

import {
  Badge,
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  shouldForwardProp,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { isValidMotionProp, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Award, Recycle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

// Enhanced animation variants with smoother curves
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const buttonContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1,
    },
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const featureCardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Dynamic color values for dark/light mode - cohesive with design system
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const accentBlue = useColorModeValue('blue.700', 'blue.600');

  return (
    <Box
      ref={heroRef}
      position='relative'
      h='100vh'
      w='full'
      overflow='hidden'>
      {/* Parallax background image */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          y: imageY,
        }}>
        <Box
          position='absolute'
          top='-10%'
          left='0'
          right='0'
          bottom='-10%'
          backgroundImage="url('/banner.png')"
          backgroundSize='cover'
          backgroundPosition='center 20%'
          backgroundRepeat='no-repeat'
        />
      </motion.div>

      {/* Gradient overlay for sophisticated look */}
      <Box
        position='absolute'
        top='0'
        left='0'
        right='0'
        bottom='0'
        bg='linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)'
        zIndex='1'
      />

      {/* Hero Content */}
      <Box
        position='absolute'
        top='0'
        left='0'
        right='0'
        bottom='0'
        zIndex='2'
        display='flex'
        alignItems='center'
        justifyContent={{ base: 'center', lg: 'flex-start' }}
        py={{ base: '20', md: '24' }}
        pl={{ base: '0', lg: '12' }}>
        <motion.div style={{ opacity }}>
          <Container
            maxW='container.xl'
            px={{ base: '6', md: '8' }}>
            {/* Centered Content */}
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              style={{ y: textY }}>
              <VStack
                spacing='8'
                color='white'
                textAlign={{ base: 'center', lg: 'left' }}
                alignItems={{ base: 'center', lg: 'flex-start' }}>
                <motion.div variants={itemVariants}>
                  {/* Updated to match commission section typography */}
                  <Heading
                    as='h1'
                    fontSize={{ base: '4xl', sm: '5xl', md: '6xl', lg: '7xl' }}
                    fontWeight='100'
                    letterSpacing='0.02em'
                    textTransform='uppercase'
                    lineHeight='1.1'
                    color='white'
                    mb='2'>
                    REDEFINING
                  </Heading>
                  <Heading
                    as='h1'
                    fontSize={{ base: '4xl', sm: '5xl', md: '6xl', lg: '7xl' }}
                    fontWeight='700'
                    letterSpacing='-0.04em'
                    textTransform='uppercase'
                    lineHeight='1'
                    color='white'
                    position='relative'>
                    <Box
                      as='span'
                      display='inline'
                      bgGradient={useColorModeValue(
                        'linear(to-r, blue.300, orange.300, green.300)',
                        'linear(to-r, blue.400, orange.400, green.400)'
                      )}
                      bgClip='text'>
                      STREETWEAR
                    </Box>
                  </Heading>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Text
                    fontSize={{ base: 'lg', md: 'xl', lg: 'lg', xl: 'xl' }}
                    color='white'
                    maxW='700px'
                    mx='auto'
                    mt={{ base: 4, md: 5, lg: 4 }}
                    fontWeight='300'
                    letterSpacing='0.02em'
                    lineHeight='1.4'
                    opacity='0.95'>
                    We transform deadstock and forgotten pieces into
                    <Box
                      as='span'
                      color={useColorModeValue('blue.300', 'blue.400')}
                      fontWeight='500'>
                      {' '}
                      exclusive streetwear{' '}
                    </Box>
                    that tells your story. Each piece is unique, sustainable, and crafted with purpose.
                  </Text>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  variants={buttonContainerVariants}
                  initial='hidden'
                  animate='visible'>
                  <HStack
                    spacing='6'
                    justify='center'
                    flexWrap='wrap'>
                    <motion.div variants={buttonVariants}>
                      <Button
                        as={Link}
                        href='/gallery'
                        display='inline-flex'
                        alignItems='center'
                        px='8'
                        py='4'
                        fontSize='sm'
                        fontWeight='600'
                        textTransform='uppercase'
                        letterSpacing='0.1em'
                        color='white'
                        bg='gray.800'
                        borderRadius='md'
                        position='relative'
                        overflow='hidden'
                        transition='all 0.3s ease'
                        _hover={{
                          bg: 'gray.900',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                        }}
                        rightIcon={<Icon as={ArrowRight} w={4} h={4} />}>
                        Explore Gallery
                      </Button>
                    </motion.div>

                    <motion.div variants={buttonVariants}>
                      <Button
                        as={Link}
                        href='/commissions'
                        display='inline-flex'
                        alignItems='center'
                        px='8'
                        py='4'
                        fontSize='sm'
                        fontWeight='600'
                        textTransform='uppercase'
                        letterSpacing='0.1em'
                        color='gray.800'
                        bg='whiteAlpha.900'
                        borderRadius='md'
                        backdropFilter='blur(10px)'
                        transition='all 0.3s ease'
                        _hover={{
                          bg: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 15px 40px rgba(255,255,255,0.2)',
                        }}
                        rightIcon={<Icon as={ArrowRight} w={4} h={4} />}>
                        Custom Commission
                      </Button>
                    </motion.div>
                  </HStack>
                </motion.div>
              </VStack>
            </motion.div>
          </Container>
        </motion.div>
      </Box>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}>
        <VStack spacing='2'>
          <Text
            fontSize='xs'
            color='white'
            letterSpacing='0.2em'
            textTransform='uppercase'
            opacity='0.7'>
            Scroll to Explore
          </Text>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}>
            <Box
              w='1px'
              h='40px'
              bg='white'
              opacity='0.5'
            />
          </motion.div>
        </VStack>
      </motion.div>
    </Box>
  );
}
