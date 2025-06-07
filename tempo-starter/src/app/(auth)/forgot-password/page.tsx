import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { forgotPasswordAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";
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

export default async function ForgotPassword(props: {
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
                    Reset Password
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Already have an account?{" "}
                    <ChakraLink
                      as={Link}
                      href="/sign-in"
                      color="black"
                      fontWeight="medium"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Sign in
                    </ChakraLink>
                  </Text>
                </Box>

                <VStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel
                      htmlFor="email"
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Email
                    </FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </FormControl>
                </VStack>

                <SubmitButton
                  formAction={forgotPasswordAction}
                  pendingText="Sending reset link..."
                  w="full"
                >
                  Reset Password
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
