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
    span: "col-span-2 row-span-2",
    size: "large",
  },
  {
    id: 2,
    name: "Bottoms",
    description: "Reconstructed pants, skirts & shorts",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    href: "/store?category=bottoms",
    span: "col-span-2 row-span-2",
    size: "large",
  },
  {
    id: 3,
    name: "Tote Bags",
    description: "Handmade from reclaimed materials",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    href: "/store?category=tote-bags",
    span: "col-span-2 row-span-1",
    size: "wide",
  },
  {
    id: 4,
    name: "Accessories",
    description: "Belts, scarves & unique pieces",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    href: "/store?category=accessories",
    span: "col-span-2 row-span-1",
    size: "wide",
  },
];

export default function CollectionsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 md:mb-24"
        >
          <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-thin tracking-tighter uppercase mb-4">
            Collections
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-24 bg-black"></div>
            <p className="text-sm font-normal text-gray-600 uppercase tracking-widest">
              Explore our curated selection
            </p>
          </div>
        </motion.div>

        {/* Experimental asymmetric grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.165, 0.84, 0.44, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
              onHoverStart={() => setHoveredId(collection.id)}
              onHoverEnd={() => setHoveredId(null)}
              className={`group cursor-pointer ${collection.span}`}
            >
              <Link href={collection.href} className="block w-full h-full">
                <div className="relative w-full h-full overflow-hidden bg-gray-100">
                  <motion.img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover filter grayscale"
                    animate={{
                      scale: hoveredId === collection.id ? 1.1 : 1,
                      filter: hoveredId === collection.id ? "grayscale(0%)" : "grayscale(100%)",
                    }}
                    transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
                  />
                  
                  {/* Dark overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredId === collection.id ? 0.4 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top content */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: hoveredId === collection.id ? 1 : 0,
                        x: hoveredId === collection.id ? 0 : -20,
                      }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <p className="text-white text-xs font-medium tracking-[0.2em] uppercase">
                        {collection.description}
                      </p>
                    </motion.div>
                    
                    {/* Bottom content */}
                    <div>
                      <h3 className={`text-white font-display uppercase tracking-tight mb-2 ${
                        collection.size === 'large' ? 'text-4xl md:text-5xl' : 
                        collection.size === 'tall' ? 'text-3xl md:text-4xl' : 
                        collection.size === 'wide' ? 'text-2xl md:text-3xl' : 
                        'text-xl md:text-2xl'
                      }`}>
                        {collection.name}
                      </h3>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: hoveredId === collection.id ? 1 : 0,
                          x: hoveredId === collection.id ? 0 : -20,
                        }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <span className="inline-flex items-center text-white text-xs font-medium tracking-[0.15em] uppercase">
                          Explore
                          <ArrowRight className="ml-2 w-3 h-3" />
                        </span>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-16 h-16"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredId === collection.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg viewBox="0 0 64 64" className="w-full h-full">
                      <path d="M0 0 L64 0 L64 64 Z" fill="white" opacity="0.1" />
                    </svg>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}