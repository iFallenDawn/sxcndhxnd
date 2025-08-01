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
} from "@chakra-ui/react";
import { Upload, X, Plus } from "lucide-react";
import { createClient } from "../../supabase/client";

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
    title: "",
    description: "",
    category: "",
    price: "",
    size: "",
    status: "available",
    originalBrand: "",
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
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

    if (!formData.title || !formData.category || !formData.price) {
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
    const supabase = createClient();

    try {
      // Upload images to storage
      const uploadPromises = uploadedImages.map(async (image) => {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(filePath, image.file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Save gallery item data to database
      const { data: galleryItem, error: dbError } = await supabase
        .from('gallery_items')
        .insert({
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          price: formData.price,
          size: formData.size || null,
          status: formData.status,
          original_brand: formData.originalBrand || null,
          image_urls: imageUrls,
          created_by: user?.id || null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

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
        title: "",
        description: "",
        category: "",
        price: "",
        size: "",
        status: "available",
        originalBrand: "",
      });
      
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images",
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
      title: "",
      description: "",
      category: "",
      price: "",
      size: "",
      status: "available",
      originalBrand: "",
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
                    <AspectRatio ratio={3/4}>
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
                  <AspectRatio ratio={3/4}>
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
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., $180"
                />
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
              <FormLabel>Original Brand</FormLabel>
              <Input
                value={formData.originalBrand}
                onChange={(e) => setFormData({ ...formData, originalBrand: e.target.value })}
                placeholder="e.g., Levi's, Vintage Army Surplus"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the item, its condition, and any unique features..."
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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