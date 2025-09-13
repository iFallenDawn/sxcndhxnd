"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const collections = [
  {
    id: 1,
    name: "Tops",
    description: "Upcycled shirts, blouses & jackets",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
    href: "/store?category=tops",
  },
  {
    id: 2,
    name: "Bottoms",
    description: "Reconstructed pants, skirts & shorts",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    href: "/store?category=bottoms",
  },
  {
    id: 3,
    name: "Tote Bags",
    description: "Handmade from reclaimed materials",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    href: "/store?category=tote-bags",
  },
  {
    id: 4,
    name: "Accessories",
    description: "Belts, scarves & unique pieces",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    href: "/store?category=accessories",
  },
];

export default function CollectionsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="min-h-screen bg-white overflow-hidden flex flex-col justify-center py-16 md:py-0 relative z-20">
      {/* Small header - minimal space */}
      <div className="flex-shrink-0 text-center py-4 md:py-8">
        <h2 className="text-lg md:text-xl font-normal text-gray-800 tracking-wide">
          Collections
        </h2>
      </div>

      {/* Grid with better mobile sizing */}
      <div className="flex-1 p-4 md:p-8 pb-6 md:pb-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[calc(100vh-12rem)] md:h-full">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              onHoverStart={() => setHoveredId(collection.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="group cursor-pointer relative h-full min-h-[200px] sm:min-h-[250px]"
            >
              <Link href={collection.href} className="block w-full h-full">
                <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-200">
                  <motion.img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: hoveredId === collection.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
                    onError={(e) => {
                      console.log(`Failed to load image for ${collection.name}:`, collection.image);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Content overlay - centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl tracking-wide text-center px-4 drop-shadow-lg">
                      {collection.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}