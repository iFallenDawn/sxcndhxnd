import { Twitter, Linkedin, Github } from "lucide-react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Stack,
  Flex,
  Link as ChakraLink,
  VisuallyHidden,
} from "@chakra-ui/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="gray.50" borderTop="1px" borderColor="gray.100">
      <Container maxW="container.xl" px={4} py={12}>
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={8}
          mb={12}
        >
          {/* Product Column */}
          <GridItem>
            <Heading
              as="h3"
              fontSize="md"
              fontWeight="semibold"
              color="gray.900"
              mb={4}
            >
              Product
            </Heading>
            <Stack gap={2}>
              <ChakraLink
                href="#features"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Features
              </ChakraLink>
              <ChakraLink
                href="#pricing"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Pricing
              </ChakraLink>
              <ChakraLink
                href="/dashboard"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Dashboard
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                API
              </ChakraLink>
            </Stack>
          </GridItem>

          {/* Company Column */}
          <GridItem>
            <Heading
              as="h3"
              fontSize="md"
              fontWeight="semibold"
              color="gray.900"
              mb={4}
            >
              Company
            </Heading>
            <Stack gap={2}>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                About
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Blog
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Careers
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Press
              </ChakraLink>
            </Stack>
          </GridItem>

          {/* Resources Column */}
          <GridItem>
            <Heading
              as="h3"
              fontSize="md"
              fontWeight="semibold"
              color="gray.900"
              mb={4}
            >
              Resources
            </Heading>
            <Stack gap={2}>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Documentation
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Help Center
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Community
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Status
              </ChakraLink>
            </Stack>
          </GridItem>

          {/* Legal Column */}
          <GridItem>
            <Heading
              as="h3"
              fontSize="md"
              fontWeight="semibold"
              color="gray.900"
              mb={4}
            >
              Legal
            </Heading>
            <Stack gap={2}>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Privacy
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Terms
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Security
              </ChakraLink>
              <ChakraLink
                href="#"
                color="gray.600"
                _hover={{ color: "blue.600" }}
              >
                Cookies
              </ChakraLink>
            </Stack>
          </GridItem>
        </Grid>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          pt={8}
          borderTop="1px"
          borderColor="gray.200"
        >
          <Text
            color="gray.600"
            mb={{ base: 4, md: 0 }}
            fontWeight="light"
            letterSpacing="wide"
          >
            © {currentYear} sxcndhxnd. All rights reserved.
          </Text>

          <Flex gap={6}>
            <ChakraLink
              href="#"
              color="gray.400"
              _hover={{ color: "gray.500" }}
            >
              <VisuallyHidden>Twitter</VisuallyHidden>
              <Twitter size={24} />
            </ChakraLink>
            <ChakraLink
              href="#"
              color="gray.400"
              _hover={{ color: "gray.500" }}
            >
              <VisuallyHidden>LinkedIn</VisuallyHidden>
              <Linkedin size={24} />
            </ChakraLink>
            <ChakraLink
              href="#"
              color="gray.400"
              _hover={{ color: "gray.500" }}
            >
              <VisuallyHidden>GitHub</VisuallyHidden>
              <Github size={24} />
            </ChakraLink>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
