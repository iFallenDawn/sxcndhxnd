'use client';

import accessoriesImage from '@/assets/img/product-photos/accessories.jpg';
import bagImage from '@/assets/img/product-photos/bag.jpg';
import pantsImage from '@/assets/img/product-photos/pants.jpg';
import topImage from '@/assets/img/product-photos/top.jpg';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const collections = [
  {
    id: 1,
    name: 'Tops',
    description: 'Upcycled shirts, blouses & jackets',
    image: topImage,
    href: '/store?category=tops',
  },
  {
    id: 2,
    name: 'Bottoms',
    description: 'Reconstructed pants, skirts & shorts',
    image: pantsImage,
    href: '/store?category=bottoms',
  },
  {
    id: 3,
    name: 'Tote Bags',
    description: 'Handmade from reclaimed materials',
    image: bagImage,
    href: '/store?category=tote-bags',
  },
  {
    id: 4,
    name: 'Accessories',
    description: 'Belts, scarves & unique pieces',
    image: accessoriesImage,
    href: '/store?category=accessories',
  },
];

export default function CollectionsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className='min-h-screen bg-white overflow-hidden flex flex-col justify-center py-12 md:py-16 lg:py-20 relative z-20'>
      {/* Small header - minimal space */}
      <div className='flex-shrink-0 text-center pb-8 md:pb-10 lg:pb-12'>
        <h2 className='text-lg md:text-xl font-normal text-gray-800 tracking-wide'>Collections</h2>
      </div>

      {/* Responsive Grid: 2x2 on mobile/tablet, 4 columns in a row on desktop */}
      <div className='flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1800px] mx-auto w-full'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-6 xl:gap-8 h-auto max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] lg:max-h-[65vh]'>
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
              className='group cursor-pointer relative h-full min-h-[220px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[400px] xl:min-h-[450px]'>
              <Link
                href={collection.href}
                className='block w-full h-full'>
                <div className='relative w-full h-full overflow-hidden rounded-lg bg-gray-200'>
                  <motion.div
                    className='relative w-full h-full'
                    animate={{
                      scale: hoveredId === collection.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}>
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className='object-cover'
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw'
                      priority={index < 2}
                    />
                  </motion.div>

                  {/* Dark overlay */}
                  <div className='absolute inset-0 bg-black/40' />

                  {/* Content overlay - centered */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <h3 className='text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl tracking-wide text-center px-4 drop-shadow-lg'>
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
