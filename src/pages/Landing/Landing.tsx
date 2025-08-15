import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigateWithLoading } from "../../hooks/useNavigateWithLoading";
import {
  LockClosedIcon,
  SparklesIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/outline";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 400,
    },
  },
  tap: {
    scale: 0.95,
  },
};

export const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigateWithLoading = useNavigateWithLoading();

  const handleGetStarted = () => {
    navigateWithLoading("/auth", {
      loadingMessage: "Preparing authentication...",
      delay: 400
    });
  };

  const features = [
    {
      icon: <LockClosedIcon className="w-10 h-10" />,
      title: "Secure",
      description: "Bank-grade encryption",
    },
    {
      icon: <SparklesIcon className="w-10 h-10" />,
      title: "Fast",
      description: "Instant transfers",
    },
    {
      icon: <HandRaisedIcon className="w-10 h-10" />,
      title: "Simple",
      description: "Just tap & go",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        className="px-8 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl font-light tracking-wider text-text-primary">
              AURAPAY
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <motion.a
              href="#features"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm tracking-wide"
              whileHover={{ scale: 1.05 }}
            >
              FEATURES
            </motion.a>
            <motion.button
              onClick={handleGetStarted}
              className="bg-text-primary text-background px-8 py-3 text-sm tracking-wide hover:bg-text-secondary transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              GET STARTED
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 relative w-10 h-10 flex flex-col justify-center items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {/* Top line */}
            <motion.div
              className="w-6 h-0.5 bg-text-primary absolute"
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 0 : -4,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            
            {/* Middle line */}
            <motion.div
              className="w-6 h-0.5 bg-text-primary absolute"
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1,
                x: isMobileMenuOpen ? 10 : 0,
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            
            {/* Bottom line */}
            <motion.div
              className="w-6 h-0.5 bg-text-primary absolute"
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? 0 : 4,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden border-t border-border/20"
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: "auto", 
                opacity: 1,
                transition: {
                  height: { duration: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.2, delay: 0.1 }
                }
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: {
                  height: { duration: 0.3, ease: "easeIn" },
                  opacity: { duration: 0.2 }
                }
              }}
            >
              <motion.div 
                className="py-6 flex flex-col space-y-6"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <motion.a
                  href="#features"
                  className="text-text-secondary hover:text-text-primary transition-colors text-sm tracking-wide"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ y: 5 }}
                >
                  FEATURES
                </motion.a>
                <motion.button
                  onClick={handleGetStarted}
                  className="bg-text-primary text-background px-8 py-3 text-sm tracking-wide hover:bg-text-secondary transition-colors text-left rounded"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  GET STARTED
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="px-8 py-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            className="text-6xl md:text-8xl font-light text-text-primary mb-8 leading-none tracking-tight"
            variants={heroVariants}
          >
            THE FUTURE
            <span className="block mt-2">OF MONEY</span>
          </motion.h1>
          <motion.p
            className="text-lg text-text-secondary mb-12 max-w-2xl mx-auto tracking-wide"
            variants={heroVariants}
          >
            Send and receive money instantly with one tap. Secure. Simple. Fast.
          </motion.p>
          <motion.button
            onClick={handleGetStarted}
            className="bg-text-primary text-background px-12 py-4 text-lg tracking-wide hover:bg-text-secondary transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            START NOW
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="px-8 py-32 bg-background-secondary/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block px-6 py-2 bg-text-primary/10 border border-text-primary/20 rounded-full mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-text-primary text-sm tracking-wide font-medium">
                FEATURES
              </span>
            </motion.div>
            <h2 className="text-5xl font-light text-text-primary mb-6 tracking-wide">
              WHY CHOOSE AURAPAY?
            </h2>
            <p className="text-text-secondary text-xl tracking-wide max-w-3xl mx-auto leading-relaxed">
              Built for the modern world with cutting-edge technology and user-first design
            </p>
          </motion.div>

          {/* Modern Grid Layout */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={featureVariants}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                {/* Background Card */}
                <div className="absolute inset-0 bg-surface border border-border/20 rounded-2xl group-hover:border-text-primary/30 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-text-primary/5" />
                
                {/* Content */}
                <div className="relative p-8 lg:p-10 text-center">
                  {/* Icon Container */}
                  <motion.div
                    className="relative mx-auto mb-8 w-20 h-20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  >
                    {/* Icon Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-text-primary/20 to-text-primary/5 rounded-2xl group-hover:from-text-primary/30 group-hover:to-text-primary/10 transition-all duration-500" />
                    
                    {/* Icon */}
                    <div className="relative w-full h-full flex items-center justify-center text-text-primary group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    
                    {/* Decorative Elements */}
                    <motion.div
                      className="absolute -inset-2 border border-text-primary/10 rounded-2xl opacity-0 group-hover:opacity-100"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>

                  {/* Feature Number */}
                  <motion.div
                    className="inline-block px-4 py-1 bg-text-primary/5 border border-text-primary/20 rounded-full mb-6 group-hover:bg-text-primary/10 group-hover:border-text-primary/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-text-primary text-xs tracking-wider font-medium">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl lg:text-3xl font-light text-text-primary mb-4 tracking-wide group-hover:text-text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-base lg:text-lg tracking-wide leading-relaxed group-hover:text-text-secondary transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover Accent */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r from-text-primary/50 to-text-primary rounded-full group-hover:w-16 transition-all duration-500"
                    style={{ transform: 'translateX(-50%)' }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="px-8 py-32"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-text-primary mb-8 tracking-wide">
            READY TO BEGIN?
          </h2>
          <p className="text-text-secondary mb-12 tracking-wide">
            Join the revolution in digital payments
          </p>
          <motion.button
            onClick={handleGetStarted}
            className="bg-text-primary text-background px-16 py-4 text-lg tracking-wide hover:bg-text-secondary transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            CREATE WALLET
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="px-8 py-16 border-t border-border/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="mb-8 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xl font-light tracking-wider text-text-primary">
                AURAPAY
              </span>
            </motion.div>
            <div className="text-center md:text-right">
              <p className="text-text-secondary text-sm tracking-wide">
                &copy; 2024 AuraPay. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};
