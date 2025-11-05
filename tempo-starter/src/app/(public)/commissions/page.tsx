'use client';

import NavbarClientOnly from '@/components/layout/navbar/navbar-client-only';
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  keyframes,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, DollarSign, FileText, Mail, Package, Palette, Sparkles, Star, User, Zap } from 'lucide-react';
import { useState } from 'react';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionGrid = motion(Grid);
const MotionFlex = motion(Flex);

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

export default function Commissions() {
  const [formHovered, setFormHovered] = useState(false);
  const bgGradient = useColorModeValue('linear(to-br, gray.50, white)', 'linear(to-br, gray.900, black)');

  const processSteps = [
    {
      step: '01',
      title: 'Consultation',
      desc: 'Share your vision through an in-depth creative consultation.',
      icon: Sparkles,
      color: 'purple.500',
    },
    {
      step: '02',
      title: 'Design',
      desc: 'Watch your ideas transform into detailed sketches and concepts.',
      icon: Palette,
      color: 'pink.500',
    },
    {
      step: '03',
      title: 'Creation',
      desc: 'Expert craftsmanship brings your unique piece to life.',
      icon: Zap,
      color: 'blue.500',
    },
    {
      step: '04',
      title: 'Delivery',
      desc: 'Receive your custom creation with premium packaging.',
      icon: Package,
      color: 'green.500',
    },
  ];

  const testimonials = [
    {
      quote: 'The attention to detail was incredible. My custom jacket exceeded all expectations.',
      author: 'Sarah M.',
      rating: 5,
    },
    {
      quote: 'A truly collaborative process that resulted in my dream dress.',
      author: 'Emma L.',
      rating: 5,
    },
  ];

  return (
    <Box
      minH='100vh'
      bg={bgGradient}>
      <NavbarClientOnly />

      {/* Hero Section with Animated Background */}
      <MotionBox
        as='section'
        py={{ base: 20, md: 32 }}
        position='relative'
        overflow='hidden'
        initial='initial'
        animate='animate'
        variants={staggerContainer}>
        <Box
          position='absolute'
          top='0'
          left='0'
          right='0'
          bottom='0'
          opacity={0.03}
          bgGradient='linear(45deg, purple.400, pink.400, blue.400)'
          animation={`${shimmer} 3s linear infinite`}
          bgSize='1000px 100%'
        />

        <Container
          maxW='container.xl'
          px={4}
          position='relative'>
          <MotionVStack
            maxW='4xl'
            mx='auto'
            textAlign='center'
            spacing={8}
            variants={fadeInUp}>
            <Badge
              colorScheme='purple'
              px={4}
              py={2}
              borderRadius='full'
              fontSize='sm'
              textTransform='uppercase'
              letterSpacing='wider'>
              Exclusive Commissions
            </Badge>

            <Heading
              as='h1'
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight='300'
              letterSpacing='tight'
              lineHeight='1.1'
              bgGradient='linear(to-r, gray.800, gray.600)'
              bgClip='text'>
              Create Your
              <Text
                as='span'
                display='block'
                fontWeight='500'
                bgGradient='linear(to-r, purple.600, pink.600)'
                bgClip='text'>
                Signature Piece
              </Text>
            </Heading>

            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color='gray.600'
              fontWeight='300'
              maxW='2xl'
              lineHeight='relaxed'>
              Collaborate with our designers to bring your vision to life. Each commission is a unique journey resulting in a one-of-a-kind garment
              crafted exclusively for you.
            </Text>

            <HStack
              spacing={4}
              pt={4}>
              <Button
                size='lg'
                bg='black'
                color='white'
                _hover={{
                  bg: 'gray.800',
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                }}
                rightIcon={<ArrowRight size={18} />}
                transition='all 0.3s'
                onClick={() => {
                  document.getElementById('commission-form')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}>
                Start Your Commission
              </Button>
              <Button
                size='lg'
                variant='outline'
                borderColor='gray.300'
                _hover={{
                  bg: 'gray.50',
                  transform: 'translateY(-2px)',
                }}
                transition='all 0.3s'>
                View Gallery
              </Button>
            </HStack>
          </MotionVStack>
        </Container>
      </MotionBox>

      {/* Process Section with Animated Cards */}
      <Box
        as='section'
        py={{ base: 20, md: 32 }}
        bg='white'>
        <Container
          maxW='container.xl'
          px={4}>
          <MotionVStack
            textAlign='center'
            mb={20}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
            variants={fadeInUp}>
            <Badge
              colorScheme='blue'
              px={4}
              py={2}
              borderRadius='full'
              fontSize='sm'
              textTransform='uppercase'
              letterSpacing='wider'
              mb={4}>
              Our Process
            </Badge>
            <Heading
              as='h2'
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight='300'
              letterSpacing='tight'>
              From Vision to Reality
            </Heading>
            <Text
              color='gray.600'
              fontSize='lg'
              maxW='2xl'>
              A seamless journey through design and creation
            </Text>
          </MotionVStack>

          <MotionGrid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={8}
            maxW='7xl'
            mx='auto'
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
            variants={staggerContainer}>
            {processSteps.map((item, index) => (
              <MotionBox
                key={item.step}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}>
                <VStack
                  bg='white'
                  p={8}
                  borderRadius='2xl'
                  boxShadow='lg'
                  border='1px'
                  borderColor='gray.100'
                  h='full'
                  position='relative'
                  overflow='hidden'
                  _hover={{
                    boxShadow: '2xl',
                    borderColor: item.color,
                  }}
                  transition='all 0.3s'>
                  <Box
                    position='absolute'
                    top='-50%'
                    right='-50%'
                    w='200%'
                    h='200%'
                    bgGradient={`radial(${item.color}, transparent)`}
                    opacity={0.05}
                    animation={`${float} 4s ease-in-out infinite`}
                    sx={{ animationDelay: `${index * 0.5}s` }}
                  />

                  <Center
                    w={20}
                    h={20}
                    bg={`${item.color.split('.')[0]}.50`}
                    borderRadius='full'
                    mb={6}
                    position='relative'>
                    <Icon
                      as={item.icon}
                      boxSize={10}
                      color={item.color}
                      animation={`${float} 3s ease-in-out infinite`}
                      sx={{ animationDelay: `${index * 0.2}s` }}
                    />
                  </Center>

                  <Text
                    fontSize='sm'
                    fontWeight='600'
                    color={item.color}
                    textTransform='uppercase'
                    letterSpacing='wider'>
                    Step {item.step}
                  </Text>

                  <Heading
                    as='h3'
                    fontSize='2xl'
                    fontWeight='500'
                    mb={3}>
                    {item.title}
                  </Heading>

                  <Text
                    color='gray.600'
                    textAlign='center'
                    fontSize='sm'
                    lineHeight='relaxed'>
                    {item.desc}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </MotionGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        as='section'
        py={{ base: 16, md: 24 }}
        bg='gray.50'>
        <Container
          maxW='container.xl'
          px={4}>
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={8}
            maxW='4xl'
            mx='auto'>
            {testimonials.map((testimonial, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}>
                <VStack
                  bg='white'
                  p={8}
                  borderRadius='xl'
                  align='start'
                  h='full'
                  boxShadow='sm'
                  _hover={{ boxShadow: 'md' }}
                  transition='all 0.3s'>
                  <HStack mb={3}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon
                        key={i}
                        as={Star}
                        boxSize={4}
                        color='yellow.400'
                        fill='yellow.400'
                      />
                    ))}
                  </HStack>
                  <Text
                    color='gray.600'
                    fontSize='lg'
                    fontStyle='italic'
                    flex={1}>
                    "{testimonial.quote}"
                  </Text>
                  <Text
                    fontWeight='500'
                    fontSize='sm'
                    color='gray.700'>
                    — {testimonial.author}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Commission Form with Enhanced Design */}
      <Box
        as='section'
        py={{ base: 20, md: 32 }}
        bg='white'
        id='commission-form'>
        <Container
          maxW='container.xl'
          px={4}>
          <MotionBox
            maxW='3xl'
            mx='auto'
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
            variants={staggerContainer}>
            <MotionVStack
              textAlign='center'
              mb={12}
              variants={fadeInUp}>
              <Badge
                colorScheme='green'
                px={4}
                py={2}
                borderRadius='full'
                fontSize='sm'
                textTransform='uppercase'
                letterSpacing='wider'
                mb={4}>
                Get Started
              </Badge>
              <Heading
                as='h2'
                fontSize={{ base: '3xl', md: '5xl' }}
                fontWeight='300'
                letterSpacing='tight'
                mb={4}>
                Begin Your Commission
              </Heading>
              <Text
                color='gray.600'
                fontSize='lg'
                maxW='xl'>
                Tell us about your dream piece and we'll bring it to life
              </Text>
            </MotionVStack>

            <MotionBox
              as='form'
              bg='gray.50'
              p={{ base: 8, md: 12 }}
              borderRadius='2xl'
              boxShadow={formHovered ? '2xl' : 'xl'}
              transition='all 0.3s'
              onMouseEnter={() => setFormHovered(true)}
              onMouseLeave={() => setFormHovered(false)}
              variants={fadeInUp}>
              <Stack spacing={8}>
                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                  gap={6}>
                  <FormControl>
                    <FormLabel
                      fontSize='sm'
                      fontWeight='500'
                      color='gray.700'
                      mb={2}>
                      First Name
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents='none'>
                        <Icon
                          as={User}
                          color='gray.400'
                          boxSize={5}
                        />
                      </InputLeftElement>
                      <Input
                        placeholder='John'
                        bg='white'
                        borderColor='gray.200'
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{
                          borderColor: 'purple.500',
                          boxShadow: '0 0 0 1px purple.500',
                        }}
                        size='lg'
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel
                      fontSize='sm'
                      fontWeight='500'
                      color='gray.700'
                      mb={2}>
                      Last Name
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents='none'>
                        <Icon
                          as={User}
                          color='gray.400'
                          boxSize={5}
                        />
                      </InputLeftElement>
                      <Input
                        placeholder='Doe'
                        bg='white'
                        borderColor='gray.200'
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{
                          borderColor: 'purple.500',
                          boxShadow: '0 0 0 1px purple.500',
                        }}
                        size='lg'
                      />
                    </InputGroup>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel
                    fontSize='sm'
                    fontWeight='500'
                    color='gray.700'
                    mb={2}>
                    Email Address
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                      <Icon
                        as={Mail}
                        color='gray.400'
                        boxSize={5}
                      />
                    </InputLeftElement>
                    <Input
                      type='email'
                      placeholder='john@example.com'
                      bg='white'
                      borderColor='gray.200'
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 0 1px purple.500',
                      }}
                      size='lg'
                    />
                  </InputGroup>
                </FormControl>

                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                  gap={6}>
                  <FormControl>
                    <FormLabel
                      fontSize='sm'
                      fontWeight='500'
                      color='gray.700'
                      mb={2}>
                      Garment Type
                    </FormLabel>
                    <Select
                      placeholder='Select garment type'
                      bg='white'
                      borderColor='gray.200'
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 0 1px purple.500',
                      }}
                      size='lg'>
                      <option value='dress'>Dress</option>
                      <option value='shirt'>Shirt</option>
                      <option value='jacket'>Jacket</option>
                      <option value='pants'>Pants</option>
                      <option value='suit'>Full Suit</option>
                      <option value='other'>Other</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel
                      fontSize='sm'
                      fontWeight='500'
                      color='gray.700'
                      mb={2}>
                      Budget Range
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents='none'>
                        <Icon
                          as={DollarSign}
                          color='gray.400'
                          boxSize={5}
                        />
                      </InputLeftElement>
                      <Input
                        placeholder='500 - 1000'
                        bg='white'
                        borderColor='gray.200'
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{
                          borderColor: 'purple.500',
                          boxShadow: '0 0 0 1px purple.500',
                        }}
                        size='lg'
                      />
                    </InputGroup>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel
                    fontSize='sm'
                    fontWeight='500'
                    color='gray.700'
                    mb={2}>
                    Project Vision
                  </FormLabel>
                  <Textarea
                    placeholder='Describe your dream piece in detail. Include preferred materials, colors, style references, and any specific requirements...'
                    rows={6}
                    bg='white'
                    borderColor='gray.200'
                    _hover={{ borderColor: 'gray.300' }}
                    _focus={{
                      borderColor: 'purple.500',
                      boxShadow: '0 0 0 1px purple.500',
                    }}
                    resize='vertical'
                  />
                </FormControl>

                <Center>
                  <Button
                    type='submit'
                    size='lg'
                    bg='black'
                    color='white'
                    _hover={{
                      bg: 'gray.800',
                      transform: 'scale(1.05)',
                    }}
                    _active={{
                      transform: 'scale(0.98)',
                    }}
                    px={12}
                    py={7}
                    fontSize='md'
                    fontWeight='500'
                    letterSpacing='wide'
                    rightIcon={<CheckCircle size={20} />}
                    transition='all 0.2s'>
                    Submit Commission Request
                  </Button>
                </Center>

                <Text
                  textAlign='center'
                  color='gray.500'
                  fontSize='sm'
                  mt={4}>
                  We'll review your request and contact you within 24-48 hours to discuss next steps.
                </Text>
              </Stack>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
