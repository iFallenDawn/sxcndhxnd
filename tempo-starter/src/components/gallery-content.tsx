"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronDown } from "lucide-react";

type ItemStatus = "available" | "sold" | "reserved";
type SortOption = "newest" | "price-low" | "price-high" | "name-az" | "name-za";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  price: string;
  size?: string;
  status: ItemStatus;
  originalBrand?: string;
  dateAdded?: Date;
}

const StatusBadge = ({ status }: { status: ItemStatus }) => {
  const statusStyles = {
    available: "bg-green-100 text-green-800 border-green-200",
    sold: "bg-gray-100 text-gray-800 border-gray-200",
    reserved: "bg-amber-100 text-amber-800 border-amber-200",
  };

  return (
    <span
      className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium tracking-wider uppercase border ${statusStyles[status]} backdrop-blur-sm bg-opacity-90 z-10`}
    >
      {status}
    </span>
  );
};

export default function GalleryContent() {
  const [statusFilter, setStatusFilter] = useState<"all" | ItemStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      alt: "Reworked Vintage Denim",
      category: "Bottoms",
      price: "$180",
      size: "32",
      status: "available",
      originalBrand: "Levi's",
      dateAdded: new Date("2024-01-15"),
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      alt: "Deconstructed Military Jacket",
      category: "Outerwear",
      price: "$320",
      size: "M",
      status: "sold",
      originalBrand: "Vintage Army Surplus",
      dateAdded: new Date("2024-01-10"),
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
      alt: "Upcycled Canvas Tote",
      category: "Bags",
      price: "$95",
      status: "available",
      originalBrand: "Repurposed Materials",
      dateAdded: new Date("2024-01-20"),
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      alt: "Reconstructed Blazer",
      category: "Outerwear",
      price: "$280",
      size: "L",
      status: "reserved",
      originalBrand: "Giorgio Armani",
      dateAdded: new Date("2024-01-18"),
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      alt: "Patchwork Denim Jacket",
      category: "Outerwear",
      price: "$245",
      size: "S",
      status: "available",
      originalBrand: "Mixed Vintage",
      dateAdded: new Date("2024-01-22"),
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
      alt: "Reworked Silk Dress",
      category: "Dresses",
      price: "$380",
      size: "M",
      status: "sold",
      originalBrand: "Vintage Dior",
      dateAdded: new Date("2024-01-12"),
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      alt: "Minimalist Crossbody Bag",
      category: "Bags",
      price: "$120",
      status: "available",
      originalBrand: "Upcycled Leather",
      dateAdded: new Date("2024-01-25"),
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      alt: "Layered Vintage Tee",
      category: "Tops",
      price: "$85",
      size: "M",
      status: "available",
      originalBrand: "Band Merch Collection",
      dateAdded: new Date("2024-01-28"),
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80",
      alt: "Reconstructed Wool Pants",
      category: "Bottoms",
      price: "$220",
      size: "30",
      status: "reserved",
      originalBrand: "Vintage YSL",
      dateAdded: new Date("2024-01-24"),
    },
  ];

  const categories = Array.from(new Set(galleryItems.map(item => item.category)));

  const sortItems = (items: GalleryItem[]) => {
    const sorted = [...items];
    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => (b.dateAdded?.getTime() || 0) - (a.dateAdded?.getTime() || 0));
      case "price-low":
        return sorted.sort((a, b) => parseInt(a.price.replace("$", "")) - parseInt(b.price.replace("$", "")));
      case "price-high":
        return sorted.sort((a, b) => parseInt(b.price.replace("$", "")) - parseInt(a.price.replace("$", "")));
      case "name-az":
        return sorted.sort((a, b) => a.alt.localeCompare(b.alt));
      case "name-za":
        return sorted.sort((a, b) => b.alt.localeCompare(a.alt));
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
          item.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.originalBrand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) => selectedCategories.includes(item.category));
    }

    // Sort
    return sortItems(filtered);
  }, [statusFilter, searchQuery, selectedCategories, sortOption]);

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
      <section className="pt-32 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-light tracking-tightest uppercase mb-3">
              Gallery
            </h1>
            <p className="text-sm font-light tracking-wide text-gray-600 max-w-xl mx-auto">
              Vintage pieces reimagined for the contemporary wardrobe
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Sticky Filter Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Search Bar - Compact */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-transparent focus:border-gray-300 focus:bg-white rounded-full focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Buttons - Compact */}
            <div className="flex items-center gap-2">
              {/* Status Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all ${
                    statusFilter !== "all" 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {statusFilter === "all" ? "All Items" : statusFilter}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden min-w-[140px] z-50">
                    {["all", "available", "sold", "reserved"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status as typeof statusFilter);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs capitalize hover:bg-gray-50 ${
                          statusFilter === status ? "bg-gray-100 font-medium" : ""
                        }`}
                      >
                        {status === "all" ? "All Items" : status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all ${
                    selectedCategories.length > 0 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  Categories
                  {selectedCategories.length > 0 && (
                    <span className="bg-white text-black text-xs w-4 h-4 rounded-full inline-flex items-center justify-center">
                      {selectedCategories.length}
                    </span>
                  )}
                </button>
                {showFilters && (
                  <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[160px] z-50">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-3 h-3 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V4" />
                  </svg>
                  Sort
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden min-w-[160px] z-50">
                    {[
                      { value: "newest", label: "Newest" },
                      { value: "price-low", label: "Price ↑" },
                      { value: "price-high", label: "Price ↓" },
                      { value: "name-az", label: "A-Z" },
                      { value: "name-za", label: "Z-A" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortOption(option.value as SortOption);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${
                          sortOption === option.value ? "bg-gray-100 font-medium" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Results Count */}
              <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
                {filteredItems.length} items
              </span>
            </div>
          </div>

          {/* Active Filters Tags */}
          {(activeFiltersCount > 0) && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-xs rounded-full">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-xs rounded-full capitalize">
                  {statusFilter}
                  <button onClick={() => setStatusFilter("all")} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategories.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-xs rounded-full">
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-black ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="pt-8 pb-32">
        <div className="container mx-auto px-4">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-7xl mx-auto"
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
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4">
                    <StatusBadge status={item.status} />
                    <img
                      src={item.src}
                      alt={item.alt}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        item.status === "sold"
                          ? "opacity-50 grayscale"
                          : "group-hover:scale-105"
                      }`}
                    />
                    {/* Hover Overlay */}
                    {item.status === "available" && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Details
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium tracking-wide">
                          {item.alt}
                        </h3>
                        <p className="text-xs font-light text-gray-500 tracking-wide mt-1">
                          {item.originalBrand}
                        </p>
                      </div>
                      <p className={`text-sm font-medium tracking-wide ${
                        item.status === "sold" ? "text-gray-400 line-through" : ""
                      }`}>
                        {item.price}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <p className="text-xs font-normal tracking-wider uppercase text-gray-600">
                        {item.category}
                      </p>
                      {item.size && (
                        <p className="text-xs font-light tracking-wide text-gray-500">
                          Size {item.size}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* About Upcycling Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tighter uppercase mb-8 text-center">
              Our Process
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <h3 className="text-lg font-medium tracking-normal uppercase mb-4">
                  Source
                </h3>
                <p className="text-sm font-light leading-relaxed tracking-wide text-gray-600">
                  Carefully selected vintage pieces from premium brands and unique finds
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium tracking-normal uppercase mb-4">
                  Reimagine
                </h3>
                <p className="text-sm font-light leading-relaxed tracking-wide text-gray-600">
                  Deconstructed and redesigned with modern silhouettes in mind
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium tracking-normal uppercase mb-4">
                  Craft
                </h3>
                <p className="text-sm font-light leading-relaxed tracking-wide text-gray-600">
                  Hand-finished with attention to detail and sustainable practices
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}