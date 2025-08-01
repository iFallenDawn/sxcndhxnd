"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

// Enhanced animation variants with smoother curves
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const buttonContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1,
    },
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <Box
      ref={heroRef}
      position="relative"
      h="100vh"
      w="full"
      overflow="hidden"
    >
      {/* Parallax background image */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          y: imageY,
        }}
      >
        <Box
          position="absolute"
          top="-10%"
          left="0"
          right="0"
          bottom="-10%"
          backgroundImage="url('/banner.png')"
          backgroundSize="cover"
          backgroundPosition="center 20%"
          backgroundRepeat="no-repeat"
        />
      </motion.div>

      {/* Gradient overlay for sophisticated look */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)"
        zIndex="1"
      />

      {/* Hero Content */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex="2"
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        pb={{ base: "20", md: "24" }}
      >
        <motion.div style={{ opacity }}>
          <Container maxW="container.xl" px={{ base: "6", md: "8" }}>
            {/* Centered Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ y: textY }}
            >
              <VStack spacing="8" color="white" textAlign="center">
                <motion.div variants={itemVariants}>
                  <Text
                    fontSize="sm"
                    fontWeight="400"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    mb="4"
                    opacity="0.8"
                  >
                    Sustainable Fashion Redefined
                  </Text>
                  <Heading
                    as="h1"
                    fontSize={{ base: "6xl", sm: "7xl", md: "8xl", lg: "9xl" }}
                    fontWeight="200"
                    letterSpacing="-0.02em"
                    textTransform="uppercase"
                    lineHeight="0.9"
                    className="font-display"
                  >
                    sxcndhxnd
                  </Heading>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="300"
                    letterSpacing="0.05em"
                    maxW="600px"
                    lineHeight="1.6"
                  >
                    Giving second life to forgotten garments through artisanal craftsmanship
                  </Text>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  variants={buttonContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <HStack spacing="6" justify="center" flexWrap="wrap">
                    <motion.div variants={buttonVariants}>
                      <Button
                        as={Link}
                        href="/store"
                        size="lg"
                        bg="white"
                        color="black"
                        _hover={{ 
                          bg: "gray.100",
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                        }}
                        rightIcon={<ArrowRight size={18} />}
                        px="10"
                        py="6"
                        fontSize="sm"
                        fontWeight="500"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        transition="all 0.3s ease"
                        borderRadius="none"
                      >
                        Explore Collection
                      </Button>
                    </motion.div>

                    <motion.div variants={buttonVariants}>
                      <Button
                        as={Link}
                        href="/gallery"
                        size="lg"
                        variant="outline"
                        borderColor="white"
                        borderWidth="2px"
                        color="white"
                        _hover={{ 
                          bg: "white",
                          color: "black",
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                        }}
                        px="10"
                        py="6"
                        fontSize="sm"
                        fontWeight="500"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        transition="all 0.3s ease"
                        borderRadius="none"
                      >
                        View Gallery
                      </Button>
                    </motion.div>
                  </HStack>
                </motion.div>
              </VStack>
            </motion.div>
          </Container>
        </motion.div>
      </Box>
          
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <VStack spacing="2">
          <Text
            fontSize="xs"
            color="white"
            letterSpacing="0.2em"
            textTransform="uppercase"
            opacity="0.7"
          >
            Scroll to Explore
          </Text>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Box
              w="1px"
              h="40px"
              bg="white"
              opacity="0.5"
            />
          </motion.div>
        </VStack>
      </motion.div>
    </Box>
  );
}
