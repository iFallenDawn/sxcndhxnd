"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export default function PhilosophySection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-5"
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(0,0,0,0.03) 35px,
            rgba(0,0,0,0.03) 70px
          )`
        }} />
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="container mx-auto px-6 md:px-8 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <h2 className="font-display text-5xl md:text-7xl font-extralight tracking-tight uppercase mb-8">
              Our Philosophy
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 mb-12"
          >
            <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-800 text-center">
              We believe in the transformative power of conscious fashion. Each piece in our collection 
              tells a story of renewal, where forgotten garments are given new life through artisanal 
              craftsmanship and thoughtful design.
            </p>
            <p className="text-lg font-light leading-relaxed text-gray-600 text-center">
              Our commitment goes beyond aesthetics. We're building a community that values sustainability, 
              quality, and the unique character that comes from reimagining what already exists.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/about"
              className="inline-flex items-center text-sm font-normal tracking-wide uppercase border-b-2 border-black hover:gap-3 transition-all duration-300 pb-1"
            >
              Discover Our Story
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}