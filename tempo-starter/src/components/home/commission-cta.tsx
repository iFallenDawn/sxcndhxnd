'use client';

import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  shouldForwardProp,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { isValidMotionProp, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Package, RefreshCw, Scissors, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

// Create motion components with Chakra UI
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const ChakraHeading = chakra(motion.h2, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const ChakraText = chakra(motion.p, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const ChakraButton = chakra(motion.button, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function CommissionCTA() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  // Dynamic color values for dark/light mode
  const bgGradient = useColorModeValue('linear(to-br, gray.900, blackAlpha.900, gray.800)', 'linear(to-br, gray.900, black, gray.800)');
  const accentColor = useColorModeValue('yellow.400', 'yellow.300');
  const textColor = useColorModeValue('white', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.300', 'gray.400');

  const processSteps = [
    {
      icon: Zap,
      title: 'COLLAB SESSION',
      desc: 'Link up & brainstorm',
      color: 'cyan.400',
    },
    {
      icon: Scissors,
      title: 'DECONSTRUCT',
      desc: 'Break down the old',
      color: 'pink.400',
    },
    {
      icon: RefreshCw,
      title: 'RECONSTRUCT',
      desc: 'Build something new',
      color: 'green.400',
    },
    {
      icon: Package,
      title: 'DELIVER',
      desc: 'Your piece, your story',
      color: 'yellow.400',
    },
  ];

  return (
    <Box
      ref={containerRef}
      position='relative'
      minH='100vh'
      overflow='hidden'
      bg='black'>
      {/* Graffiti-inspired background elements */}
      <Box
        position='absolute'
        inset={0}>
        {/* Dynamic gradient background */}
        <Box
          position='absolute'
          inset={0}
          bgGradient={bgGradient}
          opacity={0.9}
        />

        {/* Animated graffiti strokes */}
        <ChakraBox
          position='absolute'
          top='-20%'
          left='-10%'
          width='150%'
          height='150%'
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          // @ts-ignore - Motion transition type conflict with Chakra
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ y }}>
          <Box
            position='absolute'
            top='10%'
            left='20%'
            width='400px'
            height='400px'
            borderRadius='50%'
            border='3px solid'
            borderColor={accentColor}
            opacity={0.1}
            transform='rotate(45deg)'
          />
          <Box
            position='absolute'
            bottom='20%'
            right='15%'
            width='300px'
            height='300px'
            border='2px dashed'
            borderColor='purple.400'
            opacity={0.1}
            transform='rotate(-30deg)'
          />
        </ChakraBox>

        {/* Texture overlay */}
        <Box
          position='absolute'
          inset={0}
          backgroundImage='repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.01) 35px, rgba(255,255,255,.01) 70px)'
          mixBlendMode='overlay'
        />
      </Box>

      <Container
        maxW='7xl'
        position='relative'
        zIndex={1}>
        <Flex
          minH='100vh'
          align='center'
          justify='center'
          py={{ base: 20, md: 0 }}>
          <VStack
            spacing={{ base: 12, md: 16 }}
            width='full'>
            {/* Main heading with graffiti-style animation */}
            <ChakraBox
              initial={{ opacity: 0, y: 60, skewY: 5 }}
              whileInView={{ opacity: 1, y: 0, skewY: 0 }}
              // @ts-ignore - Motion transition type conflict with Chakra
              transition={{ duration: 0.8, ease: [0.21, 1.04, 0.58, 1] }}
              viewport={{ once: true, margin: '-100px' }}
              style={{ opacity, scale }}
              textAlign='center'>
              {/* Main title with streetwear typography */}
              <Heading
                as='h2'
                fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                fontWeight='black'
                textTransform='uppercase'
                lineHeight='0.9'
                color={textColor}
                letterSpacing='-0.03em'
                position='relative'>
                <Box
                  as='span'
                  display='block'
                  bgGradient={`linear(to-r, ${accentColor}, purple.400, cyan.400)`}
                  bgClip='text'
                  fontSize={{ base: '5xl', md: '7xl', lg: '8xl' }}
                  mt={2}>
                  Commissions
                </Box>
              </Heading>

              {/* Tagline with streetwear messaging */}
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color={mutedTextColor}
                maxW='2xl'
                mx='auto'
                mt={6}
                fontWeight='medium'
                letterSpacing='0.02em'>
                Your vision meets our craft. We flip deadstock and forgotten pieces into
                <Box
                  as='span'
                  color={accentColor}
                  fontWeight='bold'>
                  {' '}
                  exclusive streetwear{' '}
                </Box>
                that tells your story.
              </Text>
            </ChakraBox>

            {/* Process cards with asymmetrical layout */}
            <Grid
              templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
              gap={{ base: 4, md: 6 }}
              width='full'
              maxW='5xl'>
              {processSteps.map((step, index) => (
                <ChakraBox
                  key={step.title}
                  initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -5 : 5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  whileHover={{
                    scale: 1.05,
                    rotate: index % 2 === 0 ? 3 : -3,
                    transition: { duration: 0.2 },
                  }}
                  // @ts-ignore - Motion transition type conflict with Chakra
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.21, 1.04, 0.58, 1],
                  }}
                  viewport={{ once: true }}>
                  <Box
                    bg='blackAlpha.600'
                    backdropFilter='blur(10px)'
                    border='1px solid'
                    borderColor={step.color}
                    p={{ base: 4, md: 6 }}
                    position='relative'
                    overflow='hidden'
                    _hover={{
                      borderColor: accentColor,
                      '& .step-icon': {
                        transform: 'scale(1.2) rotate(15deg)',
                        color: accentColor,
                      },
                    }}>
                    <Icon
                      as={step.icon}
                      className='step-icon'
                      w={{ base: 8, md: 10 }}
                      h={{ base: 8, md: 10 }}
                      color={step.color}
                      mb={3}
                      transition='all 0.3s'
                    />
                    <Text
                      fontSize='xs'
                      fontWeight='bold'
                      textTransform='uppercase'
                      letterSpacing='0.1em'
                      color={textColor}
                      mb={1}>
                      {step.title}
                    </Text>
                    <Text
                      fontSize='xs'
                      color={mutedTextColor}
                      fontStyle='italic'>
                      {step.desc}
                    </Text>
                  </Box>
                </ChakraBox>
              ))}
            </Grid>

            {/* CTA with graffiti-style button */}
            <ChakraBox
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              // @ts-ignore - Motion transition type conflict with Chakra
              transition={{ duration: 0.6, delay: 0.4, ease: [0.21, 1.04, 0.58, 1] }}
              viewport={{ once: true }}>
              <ChakraButton
                as={Link}
                href='/commissions'
                display='inline-flex'
                alignItems='center'
                px={{ base: 8, md: 12 }}
                py={{ base: 4, md: 6 }}
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight='black'
                textTransform='uppercase'
                letterSpacing='0.1em'
                color='black'
                bg={accentColor}
                position='relative'
                overflow='hidden'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition='all 0.2s'
                _hover={{
                  bg: 'yellow.300',
                  '& .arrow-icon': {
                    transform: 'translateX(8px)',
                  },
                  '&::before': {
                    transform: 'translateX(0)',
                  },
                }}
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bg: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.4s',
                }}>
                Start Your Commission
                <Icon
                  as={ArrowRight}
                  className='arrow-icon'
                  ml={3}
                  w={5}
                  h={5}
                  transition='transform 0.3s'
                />
              </ChakraButton>
            </ChakraBox>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
}
