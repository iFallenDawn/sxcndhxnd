'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CommissionCTA() {
  return (
    <section className='min-h-screen flex items-center justify-center relative overflow-hidden'>
      {/* Background with gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900' />

      {/* Animated background elements */}
      <div className='absolute inset-0 opacity-20'>
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className='absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl'
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className='absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl'
        />
      </div>

      <div className='relative z-10'>
        <div className='container mx-auto px-6 md:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: '-100px' }}
            className='max-w-4xl mx-auto text-center'>
            <h2 className='font-display text-5xl md:text-7xl font-extralight tracking-tight uppercase mb-6 text-white'>Custom Commissions</h2>
            <p className='text-lg md:text-xl font-light leading-relaxed text-gray-300 mb-12 max-w-2xl mx-auto'>
              Transform your vision into reality. Work directly with our artisans to create one-of-a-kind pieces that reflect your unique style and
              values.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}>
              <Link
                href='/commissions'
                className='inline-flex items-center px-10 py-4 bg-white text-black hover:bg-gray-100 transition-all duration-300 text-sm font-normal tracking-wide uppercase group'>
                Start Your Commission
                <ArrowRight className='ml-3 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
              className='grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto'>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-light text-white mb-2'>100+</div>
                <div className='text-sm font-light text-gray-400 uppercase tracking-wide'>Custom Pieces</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-light text-white mb-2'>4-6</div>
                <div className='text-sm font-light text-gray-400 uppercase tracking-wide'>Week Process</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-light text-white mb-2'>1:1</div>
                <div className='text-sm font-light text-gray-400 uppercase tracking-wide'>Collaboration</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
