'use client';

import { useAdmin } from '@/hooks/useAdmin';
import {
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Filter as FilterIcon, Plus, Search, X, Edit2, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { createClient } from '../../../supabase/client';
import GalleryUpload from './gallery-upload';
import GalleryEdit from './gallery-edit';

type ItemStatus = 'available' | 'sold' | 'reserved';
type SortOption = 'newest' | 'price-low' | 'price-high' | 'name-az' | 'name-za';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: string;
  size?: string;
  status: ItemStatus;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  // Products table fields we'll use for display
  user_id?: string | null;
  commission_id?: string | null;
  paid?: boolean | null;
  drop_item?: boolean | null;
  drop_title?: string | null;
  created_by?: string | null;
}

const StatusBadge = ({ status }: { status: ItemStatus }) => {
  if (status === 'available') return null;

  const colorScheme = {
    sold: 'gray',
    reserved: 'orange',
  };

  return (
    <Badge
      position='absolute'
      top={2}
      left={2}
      px={2}
      py={0.5}
      fontSize='xx-small'
      fontWeight='medium'
      letterSpacing='wider'
      textTransform='uppercase'
      colorScheme={colorScheme[status]}
      backdropFilter='blur(4px)'
      zIndex={10}>
      {status}
    </Badge>
  );
};

export default function GalleryContent() {
  const [statusFilter, setStatusFilter] = useState<'all' | ItemStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const { isOpen: showFilters, onToggle: toggleFilters } = useDisclosure();
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  // Fetch gallery items from database
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const supabase = createClient();
      // Fetch from products table instead of gallery_items
      // Only fetch items that are meant for display (no commission_id)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .is('commission_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    onEditOpen();
  };

  const handleDelete = (item: GalleryItem) => {
    setSelectedItem(item);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${selectedItem.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete item');
      }

      toast({
        title: 'Item deleted',
        description: `"${selectedItem.title}" has been removed from the gallery`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refresh gallery items
      fetchGalleryItems();
      onDeleteClose();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete item',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      setSelectedItem(null);
    }
  };

  const categories = Array.from(new Set(galleryItems.map((item) => item.category)));

  const sortItems = (items: GalleryItem[]) => {
    const sorted = [...items];
    switch (sortOption) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'price-low':
        return sorted.sort((a, b) => parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', '')));
      case 'price-high':
        return sorted.sort((a, b) => parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', '')));
      case 'name-az':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-za':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = galleryItems;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setSelectedCategories([]);
    setSortOption('newest');
  };

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + selectedCategories.length + (searchQuery ? 1 : 0) + (sortOption !== 'newest' ? 1 : 0);

  return (
    <>
      {/* Header with Design System Typography */}
      <Box
        as='section'
        pt={28}
        pb={8}
        bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW='container.xl'>
          <VStack spacing={4}>
            {/* Thin/Bold Typography Contrast */}
            <Heading
              as='h1'
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '5xl' }}
              fontWeight='100'
              textTransform='uppercase'
              lineHeight='1.1'
              color={useColorModeValue('gray.800', 'gray.100')}
              letterSpacing='0.02em'
              textAlign='center'>
              CURATED
            </Heading>
            <Heading
              as='h2'
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '5xl' }}
              fontWeight='700'
              textTransform='uppercase'
              lineHeight='1'
              color={useColorModeValue('gray.800', 'gray.100')}
              letterSpacing='-0.04em'
              textAlign='center'
              position='relative'>
              <Box
                as='span'
                display='inline'
                bgGradient={useColorModeValue(
                  'linear(to-r, blue.700, green.800, orange.800)',
                  'linear(to-r, blue.600, green.700, orange.700)'
                )}
                bgClip='text'>
                INVENTORY
              </Box>
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight='300'
              letterSpacing='0.02em'
              color={useColorModeValue('gray.600', 'gray.400')}
              textAlign='center'
              maxW='600px'
              lineHeight='1.4'>
              Each piece in our collection is carefully selected and crafted from reclaimed materials,
              telling a unique story of transformation and sustainable style.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Enhanced Filter Bar with Design System */}
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        borderBottom='2px'
        borderColor={useColorModeValue('gray.100', 'gray.700')}
        position='sticky'
        top='70px'
        zIndex={10}>
        <Container
          maxW='container.xl'
          py={3}>
          <Flex
            align='center'
            gap={3}>
            {/* Search Bar - Compact */}
            <InputGroup
              maxW={{ base: 'full', lg: 'md' }}
              size='sm'>
              <InputLeftElement pointerEvents='none'>
                <Search
                  size={16}
                  color='gray'
                />
              </InputLeftElement>
              <Input
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg='gray.50'
                border='none'
                borderRadius='full'
                _focus={{
                  bg: 'white',
                  borderColor: 'gray.300',
                  boxShadow: 'sm',
                }}
                _placeholder={{ color: 'gray.500' }}
                fontSize='sm'
              />
              {searchQuery && (
                <InputRightElement>
                  <IconButton
                    aria-label='Clear search'
                    icon={<X size={14} />}
                    size='xs'
                    variant='ghost'
                    onClick={() => setSearchQuery('')}
                  />
                </InputRightElement>
              )}
            </InputGroup>

            {/* Filter Buttons - Compact */}
            <HStack
              spacing={2}
              flexShrink={0}>
              {/* Status Filter Dropdown */}
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={14} />}
                  size='sm'
                  borderRadius='md'
                  fontSize='xs'
                  fontWeight='600'
                  letterSpacing='0.1em'
                  textTransform='uppercase'
                  bg={statusFilter !== 'all' ? 'gray.800' : useColorModeValue('gray.100', 'gray.700')}
                  color={statusFilter !== 'all' ? 'white' : useColorModeValue('gray.700', 'gray.100')}
                  _hover={{
                    bg: statusFilter !== 'all' ? 'gray.900' : useColorModeValue('gray.200', 'gray.600'),
                    transform: 'translateY(-1px)',
                  }}
                  transition='all 0.2s'>
                  {statusFilter === 'all' ? 'All Items' : statusFilter}
                </MenuButton>
                <MenuList minW='140px'>
                  {['all', 'available', 'sold', 'reserved'].map((status) => (
                    <MenuItem
                      key={status}
                      onClick={() => setStatusFilter(status as typeof statusFilter)}
                      fontSize='sm'
                      textTransform='capitalize'>
                      {status === 'all' ? 'All Items' : status}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              {/* Categories Dropdown */}
              <Menu closeOnSelect={false}>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={14} />}
                  size='sm'
                  borderRadius='md'
                  fontSize='xs'
                  fontWeight='600'
                  letterSpacing='0.1em'
                  textTransform='uppercase'
                  bg={selectedCategories.length > 0 ? useColorModeValue('blue.700', 'blue.600') : useColorModeValue('gray.100', 'gray.700')}
                  color={selectedCategories.length > 0 ? 'white' : useColorModeValue('gray.700', 'gray.100')}
                  _hover={{
                    bg: selectedCategories.length > 0 ? useColorModeValue('blue.800', 'blue.700') : useColorModeValue('gray.200', 'gray.600'),
                    transform: 'translateY(-1px)',
                  }}
                  transition='all 0.2s'>
                  <HStack spacing={1}>
                    <FilterIcon size={14} />
                    <Text>Categories</Text>
                    {selectedCategories.length > 0 && (
                      <Badge
                        bg='white'
                        color='black'
                        size='xs'
                        borderRadius='full'>
                        {selectedCategories.length}
                      </Badge>
                    )}
                  </HStack>
                </MenuButton>
                <MenuList
                  minW='160px'
                  p={2}>
                  {categories.map((category) => (
                    <MenuItem
                      key={category}
                      closeOnSelect={false}
                      p={2}
                      borderRadius='md'>
                      <Checkbox
                        isChecked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        size='sm'>
                        <Text fontSize='sm'>{category}</Text>
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
                  size='sm'
                  borderRadius='full'
                  fontSize='xs'
                  fontWeight='medium'
                  letterSpacing='wide'
                  bg='gray.100'
                  color='gray.700'
                  _hover={{ bg: 'gray.200' }}>
                  Sort
                </MenuButton>
                <MenuList minW='160px'>
                  {[
                    { value: 'newest', label: 'Newest' },
                    { value: 'price-low', label: 'Price ↑' },
                    { value: 'price-high', label: 'Price ↓' },
                    { value: 'name-az', label: 'A-Z' },
                    { value: 'name-za', label: 'Z-A' },
                  ].map((option) => (
                    <MenuItem
                      key={option.value}
                      onClick={() => setSortOption(option.value as SortOption)}
                      fontSize='sm'>
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              {/* Results Count */}
              <Text
                fontSize='xs'
                color='gray.500'
                ml={2}
                display={{ base: 'none', sm: 'inline' }}>
                {filteredItems.length} items
              </Text>

              {/* Admin Upload Button */}
              {isAdmin && !adminLoading && (
                <Button
                  size='sm'
                  borderRadius='full'
                  fontSize='xs'
                  fontWeight='medium'
                  letterSpacing='wide'
                  bg='black'
                  color='white'
                  _hover={{ bg: 'gray.800' }}
                  leftIcon={<Plus size={14} />}
                  onClick={onUploadOpen}
                  ml={2}>
                  Add Item
                </Button>
              )}
            </HStack>
          </Flex>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <HStack
              spacing={2}
              mt={2}
              flexWrap='wrap'>
              {searchQuery && (
                <Tag
                  size='sm'
                  borderRadius='full'
                  bg='gray.100'>
                  <TagLabel>"{searchQuery}"</TagLabel>
                  <TagCloseButton onClick={() => setSearchQuery('')} />
                </Tag>
              )}
              {statusFilter !== 'all' && (
                <Tag
                  size='sm'
                  borderRadius='full'
                  bg='gray.100'>
                  <TagLabel textTransform='capitalize'>{statusFilter}</TagLabel>
                  <TagCloseButton onClick={() => setStatusFilter('all')} />
                </Tag>
              )}
              {selectedCategories.map((cat) => (
                <Tag
                  key={cat}
                  size='sm'
                  borderRadius='full'
                  bg='gray.100'>
                  <TagLabel>{cat}</TagLabel>
                  <TagCloseButton onClick={() => toggleCategory(cat)} />
                </Tag>
              ))}
              <Button
                size='xs'
                variant='link'
                color='gray.500'
                onClick={clearFilters}
                ml={2}>
                Clear all
              </Button>
            </HStack>
          )}
        </Container>
      </Box>

      {/* Gallery Grid with Design System */}
      <Box
        as='section'
        pt={8}
        pb={20}
        bg={useColorModeValue('gray.50', 'gray.900')}
        minH='60vh'>
        <Container
          maxW='container.2xl'
          px={{ base: 4, md: 6, lg: 8 }}>
          {loading ? (
            <Center py={20}>
              <Spinner
                size='xl'
                thickness='3px'
                color='gray.400'
              />
            </Center>
          ) : filteredItems.length === 0 ? (
            <Center py={20}>
              <VStack spacing={4}>
                <Text
                  fontSize='lg'
                  color='gray.600'>
                  No items found
                </Text>
                {activeFiltersCount > 0 && (
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </VStack>
            </Center>
          ) : (
            <motion.div layout>
              <SimpleGrid
                columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                spacing={{ base: 3, md: 4 }}
                maxW='100%'
                mx='auto'>
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
                          duration: 0.3,
                        },
                      }}>
                      <VStack
                        spacing={2}
                        role='group'
                        cursor='pointer'
                        alignItems='stretch'>
                        <Box
                          position='relative'
                          aspectRatio={1}
                          bg='gray.50'
                          overflow='hidden'>
                          <StatusBadge status={item.status} />
                          <Image
                            src={item.image_urls[0]}
                            alt={item.title}
                            objectFit='cover'
                            w='full'
                            h='full'
                            transition='transform 0.7s'
                            _groupHover={{ transform: 'scale(1.05)' }}
                            opacity={item.status === 'sold' ? 0.5 : 1}
                            filter={item.status === 'sold' ? 'grayscale(100%)' : 'none'}
                          />
                          {/* Hover Overlay */}
                          <Box
                            position='absolute'
                            inset={0}
                            bg='blackAlpha.0'
                            _groupHover={{ bg: 'blackAlpha.300' }}
                            transition='all 0.3s'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            flexDirection='column'
                            gap={2}>
                            {item.status === 'available' && (
                              <Text
                                color='white'
                                fontSize='sm'
                                fontWeight='medium'
                                letterSpacing='wider'
                                textTransform='uppercase'
                                opacity={0}
                                _groupHover={{ opacity: 1 }}
                                transition='opacity 0.3s'>
                                View Details
                              </Text>
                            )}
                            {isAdmin && (
                              <HStack
                                spacing={2}
                                opacity={0}
                                _groupHover={{ opacity: 1 }}
                                transition='opacity 0.3s'>
                                <IconButton
                                  aria-label='Edit item'
                                  icon={<Edit2 size={16} />}
                                  size='sm'
                                  colorScheme='whiteAlpha'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(item);
                                  }}
                                />
                                <IconButton
                                  aria-label='Delete item'
                                  icon={<Trash2 size={16} />}
                                  size='sm'
                                  colorScheme='red'
                                  variant='solid'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item);
                                  }}
                                />
                              </HStack>
                            )}
                          </Box>
                        </Box>

                        <VStack
                          spacing={0.5}
                          align='stretch'>
                          <Text
                            fontSize='xs'
                            fontWeight='normal'
                            letterSpacing='wide'
                            noOfLines={1}>
                            {item.title}
                          </Text>
                          <Text
                            fontSize='xs'
                            fontWeight='normal'
                            letterSpacing='wide'
                            textDecoration={item.status === 'sold' ? 'line-through' : 'none'}
                            color={item.status === 'sold' ? 'gray.400' : 'black'}>
                            {item.price}
                          </Text>
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

      {/* Gallery Upload Modal */}
      <GalleryUpload
        isOpen={isUploadOpen}
        onClose={onUploadClose}
        onUploadSuccess={() => {
          fetchGalleryItems();
        }}
      />

      {/* Gallery Edit Modal */}
      <GalleryEdit
        isOpen={isEditOpen}
        onClose={onEditClose}
        item={selectedItem}
        onEditSuccess={() => {
          fetchGalleryItems();
          setSelectedItem(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Gallery Item
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button 
                colorScheme='red' 
                onClick={confirmDelete} 
                ml={3}
                isLoading={isDeleting}
                loadingText='Deleting...'
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
