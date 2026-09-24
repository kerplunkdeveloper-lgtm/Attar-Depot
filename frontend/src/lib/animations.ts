import { Variants, Transition } from 'framer-motion';

/**
 * Attar Depot - Royal Luxury Animation Presets & Easing Curves
 * Tailored for high-end boutique perfumery with smooth 60fps micro-interactions.
 */

// Silky exponential deceleration curve for natural luxury feel
export const luxuryEase = [0.16, 1, 0.3, 1] as const;

// Responsive, crisp spring physics for drawers, modals, and interactive buttons
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
};

// Softer, floaty spring for hover states and cards
export const softSpring: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 24,
};

// Bouncy spring for micro-badges, wishlist hearts, and success checkmarks
export const popSpring: Transition = {
  type: 'spring',
  stiffness: 450,
  damping: 20,
};

/**
 * Section & Item Fade In Up
 */
export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: luxuryEase,
    },
  },
};

/**
 * Simple Smooth Fade
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: luxuryEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

/**
 * Parent Stagger Container for Grids, Lists, & Tab Bars
 */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

/**
 * Slide Over Drawer from Right (Cart Drawer, Wishlist Drawer)
 */
export const drawerRightVariants: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      damping: 32,
      stiffness: 320,
      mass: 0.85,
    },
  },
  exit: {
    x: '100%',
    transition: {
      type: 'spring',
      damping: 34,
      stiffness: 340,
    },
  },
};

/**
 * Slide Over Drawer from Left (Mobile Navigation Menu)
 */
export const drawerLeftVariants: Variants = {
  hidden: {
    x: '-100%',
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      damping: 32,
      stiffness: 320,
      mass: 0.85,
    },
  },
  exit: {
    x: '-100%',
    transition: {
      type: 'spring',
      damping: 34,
      stiffness: 340,
    },
  },
};

/**
 * Backdrop Overlay Fade (for Modals & Drawers)
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/**
 * Luxury Modal Pop & Zoom (Auth Modal, Search Vault Modal)
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 28,
      stiffness: 360,
      mass: 0.9,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

/**
 * Accordion Smooth Expanding & Collapsing
 */
export const accordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.28, ease: luxuryEase },
      opacity: { duration: 0.18 },
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.35, ease: luxuryEase },
      opacity: { duration: 0.25, delay: 0.05 },
    },
  },
};

/**
 * Step Transition Variants for Multi-Step Wizards (e.g. AuthModal Phone -> OTP -> Details)
 */
export const stepVariants: Variants = {
  initial: (direction: number = 1) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.32,
      ease: luxuryEase,
    },
  },
  exit: (direction: number = 1) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  }),
};
