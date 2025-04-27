"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingUploadButton() {
  return (
    <motion.button
      className="fixed right-6 bottom-6 z-30 size-14 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30"
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 20px 5px rgba(59, 130, 246, 0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Plus className="h-6 w-6 text-white" />
    </motion.button>
  );
}
