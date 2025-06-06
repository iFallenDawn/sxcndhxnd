import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <Box
        display="flex"
        h="100vh"
        w="full"
        alignItems="center"
        justifyContent="center"
        p={4}
        maxW={{ sm: "md" }}
      >
        <FormMessage message={searchParams} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        minH="100vh"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        bg="white"
        px={4}
        py={8}
      >
        <Container
          maxW="md"
          borderWidth={1}
          borderRadius="lg"
          bg="white"
          p={6}
          boxShadow="sm"
        >
          <UrlProvider>
            <form>
              <VStack spacing={6}>
                <Box textAlign="center">
                  <Heading size="lg" mb={2}>
                    Sign up
                  </Heading>
                  <Text color="gray.600">
                    Already have an account?{" "}
                    <Link href="/sign-in" passHref>
                      <ChakraLink
                        color="blue.500"
                        fontWeight="medium"
                        _hover={{
                          textDecoration: "underline",
                        }}
                      >
                        Sign in
                      </ChakraLink>
                    </Link>
                  </Text>
                </Box>

                <FormControl>
                  <FormLabel htmlFor="full_name">Full Name</FormLabel>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Your password"
                    minLength={6}
                    required
                  />
                </FormControl>

                <SubmitButton
                  w="full"
                  colorScheme="blue"
                  formAction={signUpAction}
                  pendingText="Signing up..."
                >
                  Sign up
                </SubmitButton>

                <FormMessage message={searchParams} />
              </VStack>
            </form>
          </UrlProvider>
        </Container>
        <SmtpMessage />
      </Box>
    </>
  );
}
