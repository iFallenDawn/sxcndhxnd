import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Image,
  Grid,
  GridItem,
  Flex,
  ButtonGroup,
} from "@chakra-ui/react";

export default function Store() {
  const products = [
    {
      id: 1,
      name: "Essential White Tee",
      price: "$85",
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      category: "Essentials",
      collection: "essentials",
    },
    {
      id: 2,
      name: "Structured Blazer",
      price: "$320",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      category: "Statement",
      collection: "statement",
    },
    {
      id: 3,
      name: "Minimalist Dress",
      price: "$195",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
      category: "Essentials",
      collection: "essentials",
    },
    {
      id: 4,
      name: "Oversized Shirt",
      price: "$145",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      category: "Statement",
      collection: "statement",
    },
    {
      id: 5,
      name: "Cropped Jacket",
      price: "$275",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      category: "Statement",
      collection: "statement",
    },
    {
      id: 6,
      name: "Relaxed Trousers",
      price: "$165",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
      category: "Essentials",
      collection: "essentials",
    },
  ];

  return (
    <Box minH="100vh" bg="white">
      <Navbar />

      {/* Hero Section */}
      <Box as="section" py={32} bg="white">
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center" mb={20}>
            <Heading
              as="h1"
              fontSize="5xl"
              fontWeight="light"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Store
            </Heading>
            <Text fontSize="xl" color="gray.700" fontWeight="light" maxW="2xl">
              Discover our carefully curated collection of minimalist pieces
              designed for the modern wardrobe.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Filter Section */}
      <Box as="section" pb={16}>
        <Container maxW="container.xl">
          <Flex justify="center" gap={8} mb={16}>
            <Button
              variant="ghost"
              fontSize="sm"
              fontWeight="light"
              letterSpacing="wide"
              textTransform="uppercase"
              borderBottom="2px"
              borderColor="black"
              borderRadius="0"
              _hover={{ bg: "transparent" }}
            >
              All
            </Button>
            <Button
              variant="ghost"
              fontSize="sm"
              fontWeight="light"
              letterSpacing="wide"
              textTransform="uppercase"
              color="gray.500"
              _hover={{ color: "black", bg: "transparent" }}
            >
              Essentials
            </Button>
            <Button
              variant="ghost"
              fontSize="sm"
              fontWeight="light"
              letterSpacing="wide"
              textTransform="uppercase"
              color="gray.500"
              _hover={{ color: "black", bg: "transparent" }}
            >
              Statement
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Products Grid */}
      <Box as="section" pb={32}>
        <Container maxW="container.xl">
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={12}
            maxW="7xl"
            mx="auto"
          >
            {products.map((product) => (
              <VStack
                key={product.id}
                spacing={6}
                role="group"
                cursor="pointer"
              >
                <Box
                  position="relative"
                  aspectRatio={4 / 5}
                  bg="gray.100"
                  overflow="hidden"
                  w="full"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    objectFit="cover"
                    w="full"
                    h="full"
                    transition="transform 0.7s"
                    _groupHover={{ transform: "scale(1.05)" }}
                  />
                </Box>
                <VStack spacing={2} textAlign="center">
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="light"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    {product.category}
                  </Text>
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontWeight="light"
                    letterSpacing="wide"
                  >
                    {product.name}
                  </Heading>
                  <Text fontSize="lg" fontWeight="light" mb={4}>
                    {product.price}
                  </Text>
                  <Button
                    variant="outline"
                    borderColor="black"
                    color="black"
                    _hover={{ bg: "black", color: "white" }}
                    fontSize="sm"
                    fontWeight="light"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    Add to Cart
                  </Button>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Collections CTA */}
      <Box as="section" py={32} bg="gray.50">
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center" mb={16}>
            <Heading
              as="h2"
              fontSize="4xl"
              fontWeight="light"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Shop by Collection
            </Heading>
            <Text color="gray.600" maxW="xl" fontWeight="light">
              Explore our thoughtfully designed collections
            </Text>
          </VStack>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={16}
            maxW="4xl"
            mx="auto"
          >
            <Link href="/store?collection=essentials">
              <VStack spacing={6} role="group">
                <Box
                  position="relative"
                  aspectRatio={4 / 5}
                  bg="gray.100"
                  overflow="hidden"
                  w="full"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
                    alt="Essentials Collection"
                    objectFit="cover"
                    w="full"
                    h="full"
                    transition="transform 0.7s"
                    _groupHover={{ transform: "scale(1.05)" }}
                  />
                </Box>
                <Heading
                  as="h3"
                  fontSize="2xl"
                  fontWeight="light"
                  letterSpacing="wide"
                  textTransform="uppercase"
                  textAlign="center"
                >
                  Essentials
                </Heading>
                <Text color="gray.600" fontWeight="light" textAlign="center">
                  Timeless basics for everyday wear
                </Text>
              </VStack>
            </Link>

            <Link href="/store?collection=statement">
              <VStack spacing={6} role="group">
                <Box
                  position="relative"
                  aspectRatio={4 / 5}
                  bg="gray.100"
                  overflow="hidden"
                  w="full"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                    alt="Statement Collection"
                    objectFit="cover"
                    w="full"
                    h="full"
                    transition="transform 0.7s"
                    _groupHover={{ transform: "scale(1.05)" }}
                  />
                </Box>
                <Heading
                  as="h3"
                  fontSize="2xl"
                  fontWeight="light"
                  letterSpacing="wide"
                  textTransform="uppercase"
                  textAlign="center"
                >
                  Statement
                </Heading>
                <Text color="gray.600" fontWeight="light" textAlign="center">
                  Bold pieces that make an impact
                </Text>
              </VStack>
            </Link>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
