import { Box, Link as ChakraLink, Container, Flex, Grid, GridItem, Heading, Stack, Text, VisuallyHidden } from '@chakra-ui/react';
import { Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as='footer'
      bg='gray.50'
      borderTop='1px'
      borderColor='gray.100'>
      <Container
        maxW='container.xl'
        px={4}
        py={12}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          align='center'
          pt={8}
          borderTop='1px'
          borderColor='gray.200'>
          <Text
            color='gray.600'
            mb={{ base: 4, md: 0 }}
            fontWeight='light'
            letterSpacing='wide'>
            © {currentYear} sxcndhxnd. All rights reserved.
          </Text>

          <Flex gap={6}>
            <ChakraLink
              href='#'
              color='gray.400'
              _hover={{ color: 'gray.500' }}>
              <VisuallyHidden>Twitter</VisuallyHidden>
              <Twitter size={24} />
            </ChakraLink>
            <ChakraLink
              href='#'
              color='gray.400'
              _hover={{ color: 'gray.500' }}>
              <VisuallyHidden>Instagram</VisuallyHidden>
              <Instagram size={24} />
            </ChakraLink>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
