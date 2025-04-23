
import React from "react";
import { motion } from "framer-motion";

interface ExhibitionDetailDescriptionProps {
  description: string;
}

const ExhibitionDetailDescription: React.FC<ExhibitionDetailDescriptionProps> = ({
  description,
}) => (
  <motion.div
    className="md:col-span-2 order-1"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.3 }}
  >
    <h2 className="text-2xl font-serif font-medium mb-6 pb-2 border-b border-stone-200">
      Über die Ausstellung
    </h2>
    <div className="prose prose-stone prose-lg max-w-none whitespace-pre-line">
      {description}
    </div>
  </motion.div>
);

export default ExhibitionDetailDescription;
