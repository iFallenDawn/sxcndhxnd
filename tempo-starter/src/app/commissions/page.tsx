import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
  Flex,
  Center,
} from "@chakra-ui/react";

export default function Commissions() {
  return (
    <Box minH="100vh" bg="white">
      <Navbar />

      {/* Hero Section */}
      <Box as="section" py={32} bg="white">
        <Container maxW="container.xl" px={4}>
          <VStack maxW="4xl" mx="auto" textAlign="center">
            <Heading
              as="h1"
              fontSize="5xl"
              fontWeight="light"
              mb={8}
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Custom Commissions
            </Heading>
            <Text
              fontSize="xl"
              color="gray.700"
              fontWeight="light"
              lineHeight="relaxed"
              mb={12}
            >
              Work directly with our designers to create unique pieces tailored
              to your vision. Each commission is a collaborative journey
              resulting in a one-of-a-kind garment.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Process Section */}
      <Box as="section" py={32} bg="gray.50">
        <Container maxW="container.xl" px={4}>
          <VStack textAlign="center" mb={20}>
            <Heading
              as="h2"
              fontSize="4xl"
              fontWeight="light"
              mb={6}
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Our Process
            </Heading>
          </VStack>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={8}
            maxW="6xl"
            mx="auto"
          >
            {[
              {
                step: "1",
                title: "Consultation",
                desc: "We discuss your vision, preferences, and requirements in detail.",
              },
              {
                step: "2",
                title: "Design",
                desc: "Our team creates initial sketches and material selections.",
              },
              {
                step: "3",
                title: "Creation",
                desc: "Skilled artisans bring your custom piece to life with precision.",
              },
              {
                step: "4",
                title: "Delivery",
                desc: "Your unique garment is carefully packaged and delivered to you.",
              },
            ].map((item) => (
              <VStack key={item.step} textAlign="center">
                <Center
                  w={16}
                  h={16}
                  bg="black"
                  color="white"
                  borderRadius="full"
                  mb={6}
                  fontSize="xl"
                  fontWeight="light"
                >
                  {item.step}
                </Center>
                <Heading
                  as="h3"
                  fontSize="xl"
                  fontWeight="light"
                  mb={4}
                  letterSpacing="wide"
                  textTransform="uppercase"
                >
                  {item.title}
                </Heading>
                <Text color="gray.600" fontWeight="light" lineHeight="relaxed">
                  {item.desc}
                </Text>
              </VStack>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Commission Form */}
      <Box as="section" py={32} bg="white">
        <Container maxW="container.xl" px={4}>
          <Box maxW="2xl" mx="auto">
            <VStack textAlign="center" mb={12}>
              <Heading
                as="h2"
                fontSize="4xl"
                fontWeight="light"
                mb={6}
                letterSpacing="wide"
                textTransform="uppercase"
              >
                Start Your Commission
              </Heading>
              <Text color="gray.600" fontWeight="light">
                Fill out the form below to begin your custom commission journey.
              </Text>
            </VStack>

            <form>
              <Stack spacing={8}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <FormControl>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="light"
                      letterSpacing="wide"
                      textTransform="uppercase"
                    >
                      First Name
                    </FormLabel>
                    <Input
                      placeholder="Enter your first name"
                      borderColor="gray.300"
                      _focus={{ borderColor: "black" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="light"
                      letterSpacing="wide"
                      textTransform="uppercase"
                    >
                      Last Name
                    </FormLabel>
                    <Input
                      placeholder="Enter your last name"
                      borderColor="gray.300"
                      _focus={{ borderColor: "black" }}
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="light"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    borderColor="gray.300"
                    _focus={{ borderColor: "black" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="light"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    Garment Type
                  </FormLabel>
                  <Input
                    placeholder="e.g., Dress, Shirt, Jacket"
                    borderColor="gray.300"
                    _focus={{ borderColor: "black" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="light"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    Budget Range
                  </FormLabel>
                  <Input
                    placeholder="e.g., $500-$1000"
                    borderColor="gray.300"
                    _focus={{ borderColor: "black" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="light"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    Project Description
                  </FormLabel>
                  <Textarea
                    placeholder="Describe your vision, preferred materials, colors, and any specific requirements..."
                    rows={6}
                    borderColor="gray.300"
                    _focus={{ borderColor: "black" }}
                    resize="none"
                  />
                </FormControl>

                <Center>
                  <Button
                    type="submit"
                    bg="black"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    px={8}
                    py={6}
                    fontSize="sm"
                    fontWeight="medium"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    Submit Commission Request
                  </Button>
                </Center>
              </Stack>
            </form>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
