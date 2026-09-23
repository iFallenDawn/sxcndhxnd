import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

/**
 * Scroll-reveal primitives shared by every home section (issue #7).
 * `whileInView` + `viewport.once` gives the v1 "fade/rise in as you scroll"
 * feel without re-triggering on scroll-back. Every variant collapses to a
 * plain, always-visible `<div>` when the user has `prefers-reduced-motion`
 * set — `useReducedMotion` reads that media query, so this is the single
 * place that guarantees the rule is respected across the whole page instead
 * of every section re-implementing the check.
 */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/** Standalone fade/rise-in-on-scroll wrapper for a single element. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

/** Stagger container — pair with `RevealItem` children for a cascade effect. */
export function RevealGroup({ children, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  )
}

/** A single staggered child of `RevealGroup`. Inert outside that context. */
export function RevealItem({ children, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
