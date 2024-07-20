import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React from "react";

export default function AnimatePopUp({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.2, // Trigger when 50% of the component is in view
  });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: inView ? 0 : 100, opacity: inView ? 1 : 0 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 1 }}
    >
      {children}
    </motion.div>
  );
}
