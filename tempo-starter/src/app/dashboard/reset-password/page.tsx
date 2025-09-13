import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/ui/form-message";
import Navbar from "@/components/layout/navbar/navbar";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

export default async function ResetPassword(props: {
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
          <form>
            <VStack spacing={6}>
              <Box textAlign="center">
                <Heading size="lg" mb={2}>
                  Reset Password
                </Heading>
                <Text color="gray.600">
                  Please enter your new password below.
                </Text>
              </Box>

              <FormControl>
                <FormLabel htmlFor="password">New password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="New password"
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="confirmPassword">
                  Confirm password
                </FormLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                />
              </FormControl>

              <SubmitButton
                w="full"
                formAction={resetPasswordAction}
                pendingText="Resetting password..."
              >
                Reset password
              </SubmitButton>

              <FormMessage message={searchParams} />
            </VStack>
          </form>
        </Container>
      </Box>
    </>
  );
}
