"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Flex,
} from "@chakra-ui/react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const buttonContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.8,
    },
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    x: 20,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

export default function Hero() {
  return (
    <Box
      position="relative"
      h="100vh" // Full height since navbar is now overlay
      w="full"
      backgroundImage="url('/banner.png')"
      backgroundSize="cover"
      backgroundPosition="center 20%"
      backgroundRepeat="no-repeat"
    >
      {/* Dark overlay for better text readability */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.400"
        zIndex="1"
      />

      {/* Hero Content */}
      <Container
        maxW="container.xl"
        h="full"
        px="4"
        position="relative"
        zIndex="2"
      >
        <Flex
          h="full"
          alignItems="flex-end"
          justifyContent="space-between"
          pb="12"
          direction={{ base: "column", lg: "row" }}
          gap={{ base: "8", lg: "0" }}
        >
          {/* Title and Description - Bottom Left */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <VStack
              align={{ base: "center", lg: "flex-start" }}
              spacing="4"
              color="white"
              maxW={{ base: "full", lg: "70%" }}
            >
              <motion.div variants={itemVariants}>
                <Heading
                  as="h1"
                  fontSize={{ base: "5xl", sm: "6xl", md: "7xl", lg: "8xl" }}
                  fontWeight="300"
                  letterSpacing="tightest"
                  textTransform="uppercase"
                  textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                  textAlign={{ base: "center", lg: "left" }}
                  className="font-display"
                >
                  sxcndhxnd
                </Heading>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="300"
                  letterSpacing="wider"
                  textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                  textAlign={{ base: "center", lg: "left" }}
                  className="font-sans"
                >
                  Giving second life to forgotten garments
                </Text>
              </motion.div>
            </VStack>
          </motion.div>

          {/* Buttons - Bottom Right */}
          <motion.div
            variants={buttonContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <HStack spacing="4" justify={{ base: "center", lg: "flex-end" }}>
              <motion.div variants={buttonVariants}>
                <Button
                  as={Link}
                  href="/store"
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  leftIcon={<ArrowUp size={16} />}
                  minW="150px"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  fontWeight="500"
                >
                  Shop Now
                </Button>
              </motion.div>

              <motion.div variants={buttonVariants}>
                <Button
                  as={Link}
                  href="/gallery"
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  minW="150px"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  fontWeight="500"
                >
                  View Gallery
                </Button>
              </motion.div>
            </HStack>
          </motion.div>
        </Flex>
      </Container>
    </Box>
  );
}
