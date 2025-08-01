"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Plus } from "lucide-react";
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  SimpleGrid,
  VStack,
  HStack,
  Flex,
  Image,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Filter as FilterIcon } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import GalleryUpload from "./gallery-upload";
import { createClient } from "../../supabase/client";

type ItemStatus = "available" | "sold" | "reserved";
type SortOption = "newest" | "price-low" | "price-high" | "name-az" | "name-za";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: string;
  size?: string;
  status: ItemStatus;
  original_brand?: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

const StatusBadge = ({ status }: { status: ItemStatus }) => {
  const colorScheme = {
    available: "green",
    sold: "gray",
    reserved: "orange",
  };

  return (
    <Badge
      position="absolute"
      top={4}
      left={4}
      px={3}
      py={1}
      fontSize="xs"
      fontWeight="medium"
      letterSpacing="wider"
      textTransform="uppercase"
      colorScheme={colorScheme[status]}
      backdropFilter="blur(4px)"
      zIndex={10}
    >
      {status}
    </Badge>
  );
};

export default function GalleryContent() {
  const [statusFilter, setStatusFilter] = useState<"all" | ItemStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const { isOpen: showFilters, onToggle: toggleFilters } = useDisclosure();
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch gallery items from database
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(galleryItems.map(item => item.category)));

  const sortItems = (items: GalleryItem[]) => {
    const sorted = [...items];
    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "price-low":
        return sorted.sort((a, b) => parseInt(a.price.replace("$", "")) - parseInt(b.price.replace("$", "")));
      case "price-high":
        return sorted.sort((a, b) => parseInt(b.price.replace("$", "")) - parseInt(a.price.replace("$", "")));
      case "name-az":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "name-za":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = galleryItems;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.original_brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) => selectedCategories.includes(item.category));
    }

    // Sort
    return sortItems(filtered);
  }, [galleryItems, statusFilter, searchQuery, selectedCategories, sortOption]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setSelectedCategories([]);
    setSortOption("newest");
  };

  const activeFiltersCount = 
    (statusFilter !== "all" ? 1 : 0) + 
    selectedCategories.length + 
    (searchQuery ? 1 : 0) +
    (sortOption !== "newest" ? 1 : 0);

  return (
    <>
      {/* Compact Hero Section */}
      <Box as="section" pt={32} pb={8} bg="white">
        <Container maxW="container.xl">
          <VStack spacing={3} textAlign="center">
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="light"
              letterSpacing="tighter"
              textTransform="uppercase"
            >
              Gallery
            </Heading>
            <Text
              fontSize="sm"
              fontWeight="light"
              letterSpacing="wide"
              color="gray.600"
              maxW="xl"
            >
              Vintage pieces reimagined for the contemporary wardrobe
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Minimal Sticky Filter Bar */}
      <Box
        position="sticky"
        top={0}
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(8px)"
        zIndex={40}
        borderBottom="1px"
        borderColor="gray.100"
      >
        <Container maxW="container.xl" py={3}>
          <Flex align="center" gap={3}>
            {/* Search Bar - Compact */}
            <InputGroup maxW={{ base: "full", lg: "md" }} size="sm">
              <InputLeftElement pointerEvents="none">
                <Search size={16} color="gray" />
              </InputLeftElement>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="gray.50"
                border="none"
                borderRadius="full"
                _focus={{
                  bg: "white",
                  borderColor: "gray.300",
                  boxShadow: "sm",
                }}
                _placeholder={{ color: "gray.500" }}
                fontSize="sm"
              />
              {searchQuery && (
                <InputRightElement>
                  <IconButton
                    aria-label="Clear search"
                    icon={<X size={14} />}
                    size="xs"
                    variant="ghost"
                    onClick={() => setSearchQuery("")}
                  />
                </InputRightElement>
              )}
            </InputGroup>

            {/* Filter Buttons - Compact */}
            <HStack spacing={2} flexShrink={0}>
              {/* Status Filter Dropdown */}
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={14} />}
                  size="sm"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                  letterSpacing="wide"
                  bg={statusFilter !== "all" ? "black" : "gray.100"}
                  color={statusFilter !== "all" ? "white" : "gray.700"}
                  _hover={{
                    bg: statusFilter !== "all" ? "gray.800" : "gray.200",
                  }}
                >
                  {statusFilter === "all" ? "All Items" : statusFilter}
                </MenuButton>
                <MenuList minW="140px">
                  {["all", "available", "sold", "reserved"].map((status) => (
                    <MenuItem
                      key={status}
                      onClick={() => setStatusFilter(status as typeof statusFilter)}
                      fontSize="sm"
                      textTransform="capitalize"
                    >
                      {status === "all" ? "All Items" : status}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              {/* Categories Dropdown */}
              <Menu closeOnSelect={false}>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={14} />}
                  size="sm"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                  letterSpacing="wide"
                  bg={selectedCategories.length > 0 ? "black" : "gray.100"}
                  color={selectedCategories.length > 0 ? "white" : "gray.700"}
                  _hover={{
                    bg: selectedCategories.length > 0 ? "gray.800" : "gray.200",
                  }}
                >
                  <HStack spacing={1}>
                    <FilterIcon size={14} />
                    <Text>Categories</Text>
                    {selectedCategories.length > 0 && (
                      <Badge
                        bg="white"
                        color="black"
                        size="xs"
                        borderRadius="full"
                      >
                        {selectedCategories.length}
                      </Badge>
                    )}
                  </HStack>
                </MenuButton>
                <MenuList minW="160px" p={2}>
                  {categories.map((category) => (
                    <MenuItem
                      key={category}
                      closeOnSelect={false}
                      p={2}
                      borderRadius="md"
                    >
                      <Checkbox
                        isChecked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        size="sm"
                      >
                        <Text fontSize="sm">{category}</Text>
                      </Checkbox>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              {/* Sort Dropdown */}
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={14} />}
                  size="sm"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                  letterSpacing="wide"
                  bg="gray.100"
                  color="gray.700"
                  _hover={{ bg: "gray.200" }}
                >
                  Sort
                </MenuButton>
                <MenuList minW="160px">
                  {[
                    { value: "newest", label: "Newest" },
                    { value: "price-low", label: "Price ↑" },
                    { value: "price-high", label: "Price ↓" },
                    { value: "name-az", label: "A-Z" },
                    { value: "name-za", label: "Z-A" },
                  ].map((option) => (
                    <MenuItem
                      key={option.value}
                      onClick={() => setSortOption(option.value as SortOption)}
                      fontSize="sm"
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              {/* Results Count */}
              <Text
                fontSize="xs"
                color="gray.500"
                ml={2}
                display={{ base: "none", sm: "inline" }}
              >
                {filteredItems.length} items
              </Text>

              {/* Admin Upload Button */}
              {isAdmin && !adminLoading && (
                <Button
                  size="sm"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                  letterSpacing="wide"
                  bg="black"
                  color="white"
                  _hover={{ bg: "gray.800" }}
                  leftIcon={<Plus size={14} />}
                  onClick={onUploadOpen}
                  ml={2}
                >
                  Add Item
                </Button>
              )}
            </HStack>
          </Flex>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <HStack spacing={2} mt={2} flexWrap="wrap">
              {searchQuery && (
                <Tag size="sm" borderRadius="full" bg="gray.100">
                  <TagLabel>"{searchQuery}"</TagLabel>
                  <TagCloseButton onClick={() => setSearchQuery("")} />
                </Tag>
              )}
              {statusFilter !== "all" && (
                <Tag size="sm" borderRadius="full" bg="gray.100">
                  <TagLabel textTransform="capitalize">{statusFilter}</TagLabel>
                  <TagCloseButton onClick={() => setStatusFilter("all")} />
                </Tag>
              )}
              {selectedCategories.map(cat => (
                <Tag key={cat} size="sm" borderRadius="full" bg="gray.100">
                  <TagLabel>{cat}</TagLabel>
                  <TagCloseButton onClick={() => toggleCategory(cat)} />
                </Tag>
              ))}
              <Button
                size="xs"
                variant="link"
                color="gray.500"
                onClick={clearFilters}
                ml={2}
              >
                Clear all
              </Button>
            </HStack>
          )}
        </Container>
      </Box>

      {/* Gallery Grid */}
      <Box as="section" pt={8} pb={32}>
        <Container maxW="container.xl">
          {loading ? (
            <Center py={20}>
              <Spinner size="xl" thickness="3px" color="gray.400" />
            </Center>
          ) : filteredItems.length === 0 ? (
            <Center py={20}>
              <VStack spacing={4}>
                <Text fontSize="lg" color="gray.600">No items found</Text>
                {activeFiltersCount > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </VStack>
            </Center>
          ) : (
            <motion.div layout>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={{ base: 8, lg: 10 }}
                maxW="7xl"
                mx="auto"
              >
                <AnimatePresence>
                  {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.25, 0.1, 0.25, 1],
                      layout: {
                        duration: 0.3
                      }
                    }}
                  >
                    <VStack
                      spacing={4}
                      role="group"
                      cursor="pointer"
                      alignItems="stretch"
                    >
                      <Box
                        position="relative"
                        aspectRatio={3/4}
                        bg="gray.50"
                        overflow="hidden"
                      >
                        <StatusBadge status={item.status} />
                        <Image
                          src={item.image_urls[0]}
                          alt={item.title}
                          objectFit="cover"
                          w="full"
                          h="full"
                          transition="transform 0.7s"
                          _groupHover={{ transform: "scale(1.05)" }}
                          opacity={item.status === "sold" ? 0.5 : 1}
                          filter={item.status === "sold" ? "grayscale(100%)" : "none"}
                        />
                        {/* Hover Overlay */}
                        {item.status === "available" && (
                          <Box
                            position="absolute"
                            inset={0}
                            bg="blackAlpha.0"
                            _groupHover={{ bg: "blackAlpha.300" }}
                            transition="all 0.3s"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text
                              color="white"
                              fontSize="sm"
                              fontWeight="medium"
                              letterSpacing="wider"
                              textTransform="uppercase"
                              opacity={0}
                              _groupHover={{ opacity: 1 }}
                              transition="opacity 0.3s"
                            >
                              View Details
                            </Text>
                          </Box>
                        )}
                      </Box>
                      
                      <VStack spacing={2} align="stretch">
                        <Flex justify="space-between" align="start">
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              letterSpacing="wide"
                            >
                              {item.title}
                            </Text>
                            <Text
                              fontSize="xs"
                              fontWeight="light"
                              color="gray.500"
                              letterSpacing="wide"
                              mt={1}
                            >
                              {item.original_brand}
                            </Text>
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            letterSpacing="wide"
                            textDecoration={item.status === "sold" ? "line-through" : "none"}
                            color={item.status === "sold" ? "gray.400" : "black"}
                          >
                            {item.price}
                          </Text>
                        </Flex>
                        
                        <Flex justify="space-between" align="center" pt={2}>
                          <Text
                            fontSize="xs"
                            fontWeight="normal"
                            letterSpacing="wider"
                            textTransform="uppercase"
                            color="gray.600"
                          >
                            {item.category}
                          </Text>
                          {item.size && (
                            <Text
                              fontSize="xs"
                              fontWeight="light"
                              letterSpacing="wide"
                              color="gray.500"
                            >
                              Size {item.size}
                            </Text>
                          )}
                        </Flex>
                      </VStack>
                    </VStack>
                  </motion.div>
                ))}
                </AnimatePresence>
              </SimpleGrid>
            </motion.div>
          )}
        </Container>
      </Box>

      {/* About Upcycling Section */}
      <Box as="section" py={32} bg="gray.50">
        <Container maxW="container.lg">
          <VStack spacing={8}>
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="light"
              letterSpacing="tighter"
              textTransform="uppercase"
              textAlign="center"
            >
              Our Process
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12} textAlign="center">
              <VStack spacing={4}>
                <Heading
                  as="h3"
                  fontSize="lg"
                  fontWeight="medium"
                  letterSpacing="normal"
                  textTransform="uppercase"
                >
                  Source
                </Heading>
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  lineHeight="relaxed"
                  letterSpacing="wide"
                  color="gray.600"
                >
                  Carefully selected vintage pieces from premium brands and unique finds
                </Text>
              </VStack>
              
              <VStack spacing={4}>
                <Heading
                  as="h3"
                  fontSize="lg"
                  fontWeight="medium"
                  letterSpacing="normal"
                  textTransform="uppercase"
                >
                  Reimagine
                </Heading>
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  lineHeight="relaxed"
                  letterSpacing="wide"
                  color="gray.600"
                >
                  Deconstructed and redesigned with modern silhouettes in mind
                </Text>
              </VStack>
              
              <VStack spacing={4}>
                <Heading
                  as="h3"
                  fontSize="lg"
                  fontWeight="medium"
                  letterSpacing="normal"
                  textTransform="uppercase"
                >
                  Craft
                </Heading>
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  lineHeight="relaxed"
                  letterSpacing="wide"
                  color="gray.600"
                >
                  Hand-finished with attention to detail and sustainable practices
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Gallery Upload Modal */}
      <GalleryUpload 
        isOpen={isUploadOpen} 
        onClose={onUploadClose}
        onUploadSuccess={() => {
          fetchGalleryItems();
        }}
      />
    </>
  );
}