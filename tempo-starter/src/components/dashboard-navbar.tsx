"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  Box,
  Flex,
  Container,
  Button,
  Text,
  Popover,
  Portal,
} from "@chakra-ui/react";
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <Box
      as="nav"
      w="full"
      borderBottom="1px"
      borderColor="gray.200"
      bg="white"
      py={4}
    >
      <Container maxW="container.xl" px={4}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={4}>
            <Link href="/" prefetch>
              <Text fontSize="xl" fontWeight="bold" cursor="pointer">
                Logo
              </Text>
            </Link>
          </Flex>
          <Flex gap={4} align="center">
            <Popover.Root>
              <Popover.Trigger>
                <Button variant="ghost" size="sm" p={2}>
                  <UserCircle size={24} />
                </Button>
              </Popover.Trigger>
              <Portal>
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Body>
                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        w="full"
                        justifyContent="flex-start"
                      >
                        Sign out
                      </Button>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
