import { motion } from "framer-motion";
import React from "react";

export default function AnimateHoover({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ scale: 1 }} // Starts at original scale
      whileHover={{ scale: 1.1 }} // Scales up to 110% when hovered
      transition={{ ease: "easeInOut", duration: 0.3 }} // Smooth transition for hover effect
    >
      {children}
    </motion.div>
  );
}
