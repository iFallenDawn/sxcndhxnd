import Link from "next/link";
import { ArrowUp } from "lucide-react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Image,
  Flex,
  VStack,
  HStack,
} from "@chakra-ui/react";

export default function Hero() {
  return (
    <Box position="relative" minH="100vh" bg="white">
      {/* Hero Content */}
      <Box position="relative" pt="32" pb="20">
        <Container maxW="container.xl" px="4">
          <VStack gap="20" maxW="3xl" mx="auto" mb="20" textAlign="center">
            <Heading
              as="h1"
              fontSize={{ base: "6xl", sm: "7xl" }}
              fontWeight="light"
              color="black"
              mb="6"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              sxcndhxnd
            </Heading>

            <Text
              fontSize="lg"
              color="gray.600"
              mb="12"
              fontWeight="light"
              letterSpacing="wide"
            >
              Minimalist streetwear for the modern individual
            </Text>

            <HStack
              gap="6"
              justify="center"
              align="center"
              flexDir={{ base: "column", sm: "row" }}
            >
              <Button as={Link} href="/store">
                <ArrowUp size={16} style={{ marginRight: "8px" }} />
                Shop Now
              </Button>

              <Button variant="outline" as={Link} href="/gallery">
                View Gallery
              </Button>
            </HStack>
          </VStack>

          {/* Latest Drop Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            gap="8"
            maxW="6xl"
            mx="auto"
          >
            <Box
              aspectRatio="3/4"
              bg="gray.100"
              overflow="hidden"
              cursor="pointer"
              _groupHover={{ transform: "scale(1.05)" }}
              transition="transform 0.5s"
            >
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                alt="Latest Drop - Minimalist Hoodie"
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
            <Box
              aspectRatio="3/4"
              bg="gray.100"
              overflow="hidden"
              cursor="pointer"
              _groupHover={{ transform: "scale(1.05)" }}
              transition="transform 0.5s"
            >
              <Image
                src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80"
                alt="Latest Drop - Essential Tee"
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
            <Box
              aspectRatio="3/4"
              bg="gray.100"
              overflow="hidden"
              cursor="pointer"
              gridColumn={{ md: "span 2", lg: "span 1" }}
              _groupHover={{ transform: "scale(1.05)" }}
              transition="transform 0.5s"
            >
              <Image
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80"
                alt="Latest Drop - Oversized Jacket"
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
