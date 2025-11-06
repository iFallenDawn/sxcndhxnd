"use client";

import NavbarClientOnly from "@/components/layout/navbar/navbar-client-only";
import Footer from "@/components/layout/footer";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Commissions() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box minH="100vh" bg={bgColor}>
      <NavbarClientOnly />

      <Box as="section" pt={28} pb={16}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="100"
              textTransform="uppercase"
              color={textColor}
            >
              CUSTOM
            </Heading>
            <Heading
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="700"
              textTransform="uppercase"
              color={textColor}
            >
              COMMISSIONS
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={mutedTextColor}
              maxW="2xl"
            >
              Full commission service coming soon. For now, explore our ready-to-wear gallery or contact us directly for custom requests.
            </Text>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}