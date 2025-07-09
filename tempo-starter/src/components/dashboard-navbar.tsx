"use client";

import Link from "next/link";
import {
  Box,
  Flex,
  Container,
  Text,
} from "@chakra-ui/react";
import UserProfile from "./user-profile";

export default function DashboardNavbar() {
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
          <UserProfile />
        </Flex>
      </Container>
    </Box>
  );
}
