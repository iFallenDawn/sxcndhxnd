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
import { ArrowRight, Package, RefreshCw, Scissors, Shirt, ShoppingBag, Zap } from 'lucide-react';
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

  // Dynamic color values for dark/light mode - muted streetwear palette
  const bgGradient = useColorModeValue('linear(to-br, gray.50, white, gray.100)', 'linear(to-br, gray.900, black, gray.800)');
  const accentColor = useColorModeValue('gray.700', 'gray.400');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'blackAlpha.600');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const processSteps = [
    {
      icon: Zap,
      title: 'COLLAB SESSION',
      desc: 'Link up & brainstorm',
      color: useColorModeValue('blue.700', 'blue.600'), // Denim blue
    },
    {
      icon: Scissors,
      title: 'DECONSTRUCT',
      desc: 'Break down the old',
      color: useColorModeValue('orange.800', 'orange.700'), // Leather brown
    },
    {
      icon: RefreshCw,
      title: 'RECONSTRUCT',
      desc: 'Build something new',
      color: useColorModeValue('green.800', 'green.700'), // Dark plaid green
    },
    {
      icon: Package,
      title: 'DELIVER',
      desc: 'Your piece, your story',
      color: useColorModeValue('gray.700', 'gray.600'), // Charcoal gray
    },
  ];

  return (
    <Box
      ref={containerRef}
      position='relative'
      minH='100vh'
      overflow='hidden'
      bg={useColorModeValue('gray.50', 'gray.900')}>
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

        {/* Animated fashion-related background elements with floating movement */}
        <ChakraBox
          position='absolute'
          top='-20%'
          left='-10%'
          width='150%'
          height='150%'
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          // @ts-ignore - Motion transition type conflict with Chakra
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          style={{ y }}>
          {/* Floating Scissors - top left */}
          <Box
            position='absolute'
            top='10%'
            left='15%'
            opacity={0.03}
            transform='rotate(-15deg)'>
            <Icon
              as={Scissors}
              w='120px'
              h='120px'
              color={useColorModeValue('gray.700', 'gray.300')}
            />
          </Box>

          {/* Floating Shirt - bottom right */}
          <Box
            position='absolute'
            bottom='20%'
            right='10%'
            opacity={0.03}
            transform='rotate(25deg)'>
            <Icon
              as={Shirt}
              w='150px'
              h='150px'
              color={useColorModeValue('gray.600', 'gray.400')}
            />
          </Box>

          {/* Tote Bag - top right */}
          <Box
            position='absolute'
            top='25%'
            right='20%'
            opacity={0.03}
            transform='rotate(-20deg)'>
            <Icon
              as={ShoppingBag}
              w='110px'
              h='110px'
              color={useColorModeValue('gray.700', 'gray.300')}
            />
          </Box>

          {/* Another Scissors - middle right */}
          <Box
            position='absolute'
            top='60%'
            right='35%'
            opacity={0.02}
            transform='rotate(45deg)'>
            <Icon
              as={Scissors}
              w='100px'
              h='100px'
              color={useColorModeValue('gray.600', 'gray.400')}
            />
          </Box>

          {/* Package icon - bottom left */}
          <Box
            position='absolute'
            bottom='15%'
            left='30%'
            opacity={0.03}
            transform='rotate(-30deg)'>
            <Icon
              as={Package}
              w='80px'
              h='80px'
              color={useColorModeValue('gray.700', 'gray.300')}
            />
          </Box>

          {/* Pants/Bottoms (using rotated rectangle to simulate pants) - left middle */}
          <Box
            position='absolute'
            top='45%'
            left='8%'
            opacity={0.03}
            transform='rotate(15deg)'>
            <Box
              width='90px'
              height='140px'
              borderWidth='3px'
              borderColor={useColorModeValue('gray.600', 'gray.400')}
              borderStyle='solid'
              borderRadius='4px'
              position='relative'>
              <Box
                position='absolute'
                top='60%'
                left='50%'
                width='2px'
                height='40%'
                bg={useColorModeValue('gray.600', 'gray.400')}
                transform='translateX(-50%)'
              />
            </Box>
          </Box>

          {/* Another Tote Bag - bottom middle */}
          <Box
            position='absolute'
            bottom='35%'
            left='55%'
            opacity={0.025}
            transform='rotate(35deg)'>
            <Icon
              as={ShoppingBag}
              w='95px'
              h='95px'
              color={useColorModeValue('gray.600', 'gray.400')}
            />
          </Box>

          {/* Additional Shirt - top middle */}
          <Box
            position='absolute'
            top='15%'
            left='45%'
            opacity={0.025}
            transform='rotate(-40deg)'>
            <Icon
              as={Shirt}
              w='85px'
              h='85px'
              color={useColorModeValue('gray.700', 'gray.300')}
            />
          </Box>
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
              {/* Main title with consistent typography */}
              <Heading
                as='h2'
                fontSize={{ base: '5xl', sm: '6xl', md: '7xl', lg: '8xl' }}
                fontWeight='100'
                textTransform='uppercase'
                lineHeight='0.85'
                color={textColor}
                letterSpacing='-0.04em'
                position='relative'
                mb='2'>
                CUSTOM
              </Heading>
              <Heading
                as='h2'
                fontSize={{ base: '5xl', sm: '6xl', md: '7xl', lg: '8xl' }}
                fontWeight='700'
                textTransform='uppercase'
                lineHeight='0.85'
                color={textColor}
                letterSpacing='-0.04em'
                position='relative'>
                <Box
                  as='span'
                  display='inline'
                  bgGradient={useColorModeValue('linear(to-r, blue.700, orange.800, gray.700)', 'linear(to-r, blue.600, orange.700, gray.600)')}
                  bgClip='text'>
                  COMMISSIONS
                </Box>
              </Heading>

              {/* Tagline with consistent messaging */}
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                color={mutedTextColor}
                maxW='700px'
                mx='auto'
                mt={8}
                fontWeight='300'
                letterSpacing='0.02em'
                lineHeight='1.4'>
                Your vision meets our craft. We flip deadstock and forgotten pieces into
                <Box
                  as='span'
                  color={useColorModeValue('blue.700', 'blue.400')}
                  fontWeight='500'>
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
                    bg={cardBg}
                    backdropFilter='blur(10px)'
                    border='2px solid'
                    borderColor={borderColor}
                    boxShadow='md'
                    p={{ base: 4, md: 6 }}
                    position='relative'
                    overflow='hidden'
                    transition='all 0.3s'
                    _hover={{
                      borderColor: step.color,
                      boxShadow: 'xl',
                      transform: 'translateY(-4px)',
                      '& .step-icon': {
                        transform: 'scale(1.2) rotate(15deg)',
                        color: step.color,
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
                px='8'
                py='4'
                fontSize='sm'
                fontWeight='600'
                textTransform='uppercase'
                letterSpacing='0.1em'
                color='white'
                bg='gray.800'
                borderRadius='none'
                position='relative'
                overflow='hidden'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition='all 0.3s ease'
                _hover={{
                  bg: 'gray.900',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                  '& .arrow-icon': {
                    transform: 'translateX(4px)',
                  },
                }}>
                Start Your Commission
                <Icon
                  as={ArrowRight}
                  className='arrow-icon'
                  ml={2}
                  w={4}
                  h={4}
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
