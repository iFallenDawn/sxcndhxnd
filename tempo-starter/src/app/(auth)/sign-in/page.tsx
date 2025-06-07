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
import Navbar from "@/components/navbar";
import { signInAction } from "@/app/actions";

export default async function SignIn(props: {
  searchParams: Promise<Message>;
}) {
  const message = await props.searchParams;

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
          <form>
            <VStack spacing={6}>
              <Box textAlign="center">
                <Heading size="lg" mb={2}>
                  Sign In
                </Heading>
                <Text color="gray.600">
                  Enter your credentials to access your account
                </Text>
              </Box>

              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </FormControl>

              <FormControl>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <FormLabel htmlFor="password" mb={0}>
                    Password
                  </FormLabel>
                  <ChakraLink
                    as={Link}
                    href="/forgot-password"
                    fontSize="sm"
                    color="gray.500"
                    _hover={{
                      color: "gray.700",
                      textDecoration: "underline",
                    }}
                  >
                    Forgot Password?
                  </ChakraLink>
                </Box>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                />
              </FormControl>

              <SubmitButton
                w="full"
                colorScheme="blue"
                pendingText="Signing in..."
                formAction={signInAction}
              >
                Sign in
              </SubmitButton>

              <FormMessage message={message} />
            </VStack>
          </form>
        </Container>
      </Box>
    </>
  );
}
