"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Image,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  SimpleGrid,
  AspectRatio,
  Spinner,
  CloseButton,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { Save, Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid'

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: string;
  size?: string;
  status: 'available' | 'sold' | 'reserved';
  image_urls: string[];
  created_at: string;
  updated_at: string;
  // Products table fields
  user_id?: string | null;
  commission_id?: string | null;
  paid?: boolean | null;
  drop_item?: boolean | null;
  drop_title?: string | null;
  created_by?: string | null;
}

interface GalleryEditProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  item: GalleryItem | null;
}

interface UploadedImage {
  file?: File;
  preview: string;
  id: string;
  isExisting?: boolean;
}

export default function GalleryEdit({ isOpen, onClose, onEditSuccess, item }: GalleryEditProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    status: "available" as 'available' | 'sold' | 'reserved',
    category: "",
    size: "",
    // Additional products fields
    user_id: null as string | null,
    commission_id: null as string | null,
    paid: false,
    drop_item: false,
    drop_title: ""
  });

  // Load item data when modal opens
  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        title: item.title,
        description: item.description || "",
        price: item.price,
        status: item.status,
        category: item.category,
        size: item.size || "",
        user_id: item.user_id || null,
        commission_id: item.commission_id || null,
        paid: item.paid || false,
        drop_item: item.drop_item || false,
        drop_title: item.drop_title || ""
      });

      // Load existing images
      const existingImages = item.image_urls.map(url => ({
        preview: url,
        id: uuidv4(),
        isExisting: true
      }));
      setUploadedImages(existingImages);
    }
  }, [item, isOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: uuidv4(),
      isExisting: false
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image && !image.isExisting && image.file) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!item) return;

    if (uploadedImages.length === 0) {
      toast({
        title: "No images",
        description: "Please keep at least one image",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.title || !formData.category || !formData.price || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUpdating(true);

    try {
      // Upload new images
      const newImageUrls = await Promise.all(
        uploadedImages
          .filter(img => !img.isExisting && img.file)
          .map(async (image) => {
            const imageFormData = new FormData()
            imageFormData.append('image', image.file!)
            imageFormData.append('id', image.id)

            const uploadResponse = await fetch('/api/images', {
              method: 'POST',
              body: imageFormData
            })
            
            if (!uploadResponse.ok) {
              const error = await uploadResponse.json()
              throw new Error(error.error || 'Failed to upload image')
            }
            
            const result = await uploadResponse.json()
            return result.publicUrl;
          })
      );

      // Combine existing and new image URLs
      const existingUrls = uploadedImages
        .filter(img => img.isExisting)
        .map(img => img.preview);
      
      const allImageUrls = [...existingUrls, ...newImageUrls];

      // Update product item
      const updateData = {
        ...formData,
        size: formData.size || null,
        image_urls: allImageUrls
      };

      const response = await fetch(`/api/products/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update item');
      }

      toast({
        title: "Item updated successfully",
        description: `"${formData.title}" has been updated`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onEditSuccess();
      onClose();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      console.error(errorMessage)
      toast({
        title: "Update failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  const cleanup = () => {
    uploadedImages.forEach(image => {
      if (!image.isExisting && image.file) {
        URL.revokeObjectURL(image.preview);
      }
    });
    setUploadedImages([]);
    setFormData({
      title: "",
      description: "",
      price: "",
      status: "available",
      category: "",
      size: "",
      user_id: null,
      commission_id: null,
      paid: false,
      drop_item: false,
      drop_title: ""
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        cleanup();
        onClose();
      }}
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Gallery Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Image Upload Section */}
            <Box>
              <FormLabel>Images</FormLabel>
              <SimpleGrid columns={3} spacing={4}>
                {uploadedImages.map((image) => (
                  <Box key={image.id} position="relative">
                    <AspectRatio ratio={3 / 4}>
                      <Image
                        src={image.preview}
                        alt="Item image"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    </AspectRatio>
                    <CloseButton
                      position="absolute"
                      top={2}
                      right={2}
                      size="sm"
                      bg="white"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => removeImage(image.id)}
                    />
                  </Box>
                ))}

                {uploadedImages.length < 6 && (
                  <AspectRatio ratio={3 / 4}>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      borderStyle="dashed"
                      borderWidth={2}
                      _hover={{ bg: "gray.50" }}
                    >
                      <VStack spacing={2}>
                        <Plus size={24} />
                        <Text fontSize="sm">Add Image</Text>
                      </VStack>
                    </Button>
                  </AspectRatio>
                )}
              </SimpleGrid>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                display="none"
              />
            </Box>

            {/* Form Fields */}
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Reworked Vintage Denim"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the item, its condition, and any unique features..."
                rows={3}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Select category"
              >
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Dresses">Dresses</option>
                <option value="Bags">Bags</option>
                <option value="Accessories">Accessories</option>
              </Select>
            </FormControl>

            <HStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <NumberInput
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e })}
                  min={0}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Size</FormLabel>
                <Input
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., M, 32"
                />
              </FormControl>
            </HStack>


            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'available' | 'sold' | 'reserved' })}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => {
            cleanup();
            onClose();
          }}>
            Cancel
          </Button>
          <Button
            colorScheme="black"
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
            onClick={handleSubmit}
            isLoading={updating}
            loadingText="Updating..."
            leftIcon={<Save size={16} />}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}