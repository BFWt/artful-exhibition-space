
import React from "react";
import { motion } from "framer-motion";
import { Music, User, Utensils } from "lucide-react";

interface Contributor {
  name: string;
  icon: string;
}

interface ExhibitionDetailContributorsProps {
  contributors: Contributor[];
}

const ExhibitionDetailContributors: React.FC<ExhibitionDetailContributorsProps> = ({
  contributors,
}) => {
  if (!contributors || contributors.length === 0) return null;
  return (
    <motion.div
      className="order-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h2 className="text-2xl font-serif font-medium mb-6 pb-2 border-b border-stone-200">
        Mitwirkende
      </h2>
      <div className="flex flex-wrap gap-2">
        {contributors.map((contributor, index) => (
          <div
            key={index}
            className="bg-stone-100 rounded-full px-3 py-1 text-sm flex items-center"
          >
            {contributor.icon === "music" && (
              <Music className="h-3 w-3 mr-1" />
            )}
            {contributor.icon === "user" && (
              <User className="h-3 w-3 mr-1" />
            )}
            {contributor.icon === "food" && (
              <Utensils className="h-3 w-3 mr-1" />
            )}
            <span>{contributor.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExhibitionDetailContributors;
