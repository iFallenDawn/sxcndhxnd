"use client";

import { useState, useRef } from "react";
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
  IconButton,
  SimpleGrid,
  AspectRatio,
  Spinner,
  CloseButton,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { Upload, X, Plus } from "lucide-react";
import { createClient } from "../../supabase/client";
import { v4 as uuidv4 } from 'uuid'

interface GalleryUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

export default function GalleryUpload({ isOpen, onClose, onUploadSuccess }: GalleryUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    user_id: null,
    commission_id: null,
    title: "",
    description: "",
    price: "",
    status: "available",
    paid: "",
    drop_item: "",
    drop_title: "",
    category: "",
    size: ""
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: uuidv4(),
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to upload",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.title || !formData.category || !formData.price! || !formData.description || !formData.status) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);

    try {
      // Upload images to storage
      const uploadPromises = uploadedImages.map(async (image) => {
        const imageFormData = new FormData()
        imageFormData.append('image', image.file)
        imageFormData.append('id', image.id)

        const uploadToBucketResponse = await fetch('/api/images', {
          method: 'POST',
          body: imageFormData
        })
        const result = await uploadToBucketResponse.json()
        if (!uploadToBucketResponse.ok) {
          throw new Error(result.error)
        }

        return result.publicUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);

      const productData = {
        ...formData,
        image_urls: imageUrls
      }

      const saveToDatabaseResponse = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      })

      const result = await saveToDatabaseResponse.json()
      if (!saveToDatabaseResponse.ok) {
        throw new Error(result.error)
      }

      toast({
        title: "Item added successfully",
        description: `"${formData.title}" has been added to the gallery`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setUploadedImages([]);
      setFormData({
        user_id: null,
        commission_id: null,
        title: "",
        description: "",
        price: "",
        status: "available",
        paid: "",
        drop_item: "",
        drop_title: "",
        category: "",
        size: ""
      });

      onUploadSuccess();
      onClose();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      console.error(errorMessage)
      toast({
        title: "Upload failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const cleanup = () => {
    uploadedImages.forEach(image => {
      URL.revokeObjectURL(image.preview);
    });
    setUploadedImages([]);
    setFormData({
      user_id: null,
      commission_id: null,
      title: "",
      description: "",
      price: "",
      status: "available",
      paid: "",
      drop_item: "",
      drop_title: "",
      category: "",
      size: ""
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
        <ModalHeader>Add to Gallery</ModalHeader>
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
                        alt="Upload preview"
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
                  defaultValue={60.45}
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

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Drop Item</FormLabel>
                <Select
                  value={formData.drop_item}
                  onChange={(e) => setFormData({ ...formData, drop_item: e.target.value })}
                  placeholder="Select..."
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Drop Title</FormLabel>
                <Input
                  value={formData.drop_title}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., NicoLand March 2025"
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="sold">Archived</option>
              </Select>
            </FormControl>

            {/* at some point can add something to attach it to specific users or commissions */}

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
            isLoading={uploading}
            loadingText="Uploading..."
            leftIcon={<Upload size={16} />}
          >
            Upload to Gallery
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}