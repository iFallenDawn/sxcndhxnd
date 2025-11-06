'use client';

import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link as ChakraLink,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { motion, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavbarChakraProps {
  user: User | null;
  children?: React.ReactNode;
}

const MotionBox = motion(Box);

export default function NavbarChakra({ user, children }: NavbarChakraProps) {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Update scroll state
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setHasScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Pages with dark backgrounds where navbar should be light
  const darkBackgroundPages = ['/'];
  const isDarkBackground = darkBackgroundPages.includes(pathname) && !hasScrolled;

  // Dynamic color values for the design system
  const bgColor = useColorModeValue(
    hasScrolled ? 'whiteAlpha.900' : isDarkBackground ? 'transparent' : 'white',
    hasScrolled ? 'blackAlpha.800' : isDarkBackground ? 'transparent' : 'gray.900'
  );

  const textColor = useColorModeValue(
    isDarkBackground && !hasScrolled ? 'white' : 'gray.800',
    isDarkBackground && !hasScrolled ? 'white' : 'gray.100'
  );

  const hoverColor = useColorModeValue(
    isDarkBackground && !hasScrolled ? 'whiteAlpha.700' : 'gray.600',
    isDarkBackground && !hasScrolled ? 'whiteAlpha.700' : 'gray.300'
  );

  const logoGradient = useColorModeValue(
    'linear(to-r, blue.700, orange.800)',
    'linear(to-r, blue.600, orange.700)'
  );

  const menuItems = [
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/commissions', label: 'Commissions' },
  ];

  return (
    <>
      <MotionBox
        as='nav'
        position='fixed'
        top={0}
        left={0}
        right={0}
        w='full'
        zIndex={50}
        bg={bgColor}
        backdropFilter={hasScrolled ? 'blur(10px)' : 'none'}
        boxShadow={hasScrolled ? 'sm' : 'none'}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <Container maxW='container.xl' px={{ base: 6, md: 8 }}>
          <Flex
            h='70px'
            align='center'
            justify='space-between'>
            {/* Logo with gradient */}
            <ChakraLink
              as={Link}
              href='/'
              _hover={{ textDecoration: 'none' }}>
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight='100'
                letterSpacing='0.02em'
                textTransform='uppercase'
                bgGradient={isDarkBackground && !hasScrolled ? 'none' : logoGradient}
                bgClip='text'
                color={isDarkBackground && !hasScrolled ? 'white' : undefined}
                transition='all 0.3s'>
                sxcndhxnd
              </Text>
            </ChakraLink>

            {/* Desktop Navigation */}
            <HStack
              spacing={8}
              display={{ base: 'none', lg: 'flex' }}
              align='center'>
              {menuItems.map((item) => (
                <ChakraLink
                  key={item.href}
                  as={Link}
                  href={item.href}
                  fontSize='sm'
                  fontWeight='500'
                  letterSpacing='0.05em'
                  textTransform='uppercase'
                  color={textColor}
                  position='relative'
                  transition='all 0.3s'
                  _hover={{
                    color: hoverColor,
                    '&::after': {
                      width: '100%',
                    },
                  }}
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    width: pathname === item.href ? '100%' : '0',
                    height: '2px',
                    bg: 'currentColor',
                    transition: 'width 0.3s ease',
                  }}>
                  {item.label}
                </ChakraLink>
              ))}

              {/* Auth Section */}
              <HStack spacing={4} ml={6}>
                {user ? (
                  <>
                    <ChakraLink
                      as={Link}
                      href='/dashboard'
                      fontSize='sm'
                      fontWeight='500'
                      letterSpacing='0.05em'
                      textTransform='uppercase'
                      color={textColor}
                      transition='all 0.3s'
                      _hover={{ color: hoverColor }}>
                      Account
                    </ChakraLink>
                    {children}
                  </>
                ) : (
                  <>
                    <ChakraLink
                      as={Link}
                      href='/sign-in'
                      fontSize='sm'
                      fontWeight='500'
                      letterSpacing='0.05em'
                      textTransform='uppercase'
                      color={textColor}
                      transition='all 0.3s'
                      _hover={{ color: hoverColor }}>
                      Sign In
                    </ChakraLink>
                    <Button
                      as={Link}
                      href='/sign-up'
                      size='sm'
                      px={6}
                      fontSize='xs'
                      fontWeight='600'
                      letterSpacing='0.1em'
                      textTransform='uppercase'
                      color='white'
                      bg='gray.800'
                      borderRadius='md'
                      _hover={{
                        bg: 'gray.900',
                        transform: 'translateY(-2px)',
                      }}
                      transition='all 0.3s'>
                      Join
                    </Button>
                  </>
                )}
              </HStack>
            </HStack>

            {/* Mobile Menu Button */}
            <IconButton
              aria-label='Toggle menu'
              icon={<Icon as={isOpen ? X : Menu} boxSize={6} />}
              variant='ghost'
              color={textColor}
              display={{ lg: 'none' }}
              onClick={onOpen}
            />
          </Flex>
        </Container>
      </MotionBox>

      {/* Mobile Drawer Menu */}
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size='xs'>
        <DrawerOverlay />
        <DrawerContent
          bg={useColorModeValue('white', 'gray.900')}
          pt={4}>
          <DrawerCloseButton size='lg' />
          <DrawerBody pt={16}>
            <VStack
              spacing={6}
              align='stretch'>
              {menuItems.map((item) => (
                <ChakraLink
                  key={item.href}
                  as={Link}
                  href={item.href}
                  onClick={onClose}
                  fontSize='xl'
                  fontWeight='300'
                  letterSpacing='0.05em'
                  textTransform='uppercase'
                  color={useColorModeValue('gray.800', 'gray.100')}
                  transition='all 0.3s'
                  _hover={{
                    color: useColorModeValue('blue.700', 'blue.400'),
                    transform: 'translateX(8px)',
                  }}>
                  {item.label}
                </ChakraLink>
              ))}

              <Box
                borderTop='1px'
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                pt={6}
                mt={4}>
                {user ? (
                  <ChakraLink
                    as={Link}
                    href='/dashboard'
                    onClick={onClose}
                    fontSize='xl'
                    fontWeight='300'
                    letterSpacing='0.05em'
                    textTransform='uppercase'
                    color={useColorModeValue('gray.800', 'gray.100')}
                    transition='all 0.3s'
                    _hover={{
                      color: useColorModeValue('blue.700', 'blue.400'),
                      transform: 'translateX(8px)',
                    }}>
                    Account
                  </ChakraLink>
                ) : (
                  <VStack spacing={4} align='stretch'>
                    <ChakraLink
                      as={Link}
                      href='/sign-in'
                      onClick={onClose}
                      fontSize='xl'
                      fontWeight='300'
                      letterSpacing='0.05em'
                      textTransform='uppercase'
                      color={useColorModeValue('gray.800', 'gray.100')}
                      transition='all 0.3s'
                      _hover={{
                        color: useColorModeValue('blue.700', 'blue.400'),
                        transform: 'translateX(8px)',
                      }}>
                      Sign In
                    </ChakraLink>
                    <Button
                      as={Link}
                      href='/sign-up'
                      onClick={onClose}
                      size='lg'
                      w='full'
                      fontSize='sm'
                      fontWeight='600'
                      letterSpacing='0.1em'
                      textTransform='uppercase'
                      color='white'
                      bg='gray.800'
                      borderRadius='md'
                      _hover={{
                        bg: 'gray.900',
                        transform: 'scale(1.02)',
                      }}
                      transition='all 0.3s'>
                      Join Now
                    </Button>
                  </VStack>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}