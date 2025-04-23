
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, User, Music } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Contributor {
  name: string;
  icon: string;
}
type ExhibitionState = "past" | "current" | "upcoming";
interface ExhibitionDetailHeaderProps {
  title: string;
  subtitle?: string;
  artist?: string;
  formattedDate: string;
  contributors?: Contributor[];
  exhibitionState: ExhibitionState;
  onBack: () => void;
}
const ExhibitionDetailHeader: React.FC<ExhibitionDetailHeaderProps> = ({
  title,
  subtitle,
  artist,
  formattedDate,
  contributors,
  exhibitionState,
  onBack,
}) => {
  return (
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-left">
        <button
          onClick={onBack}
          className="inline-flex items-center text-stone-600 hover:text-stone-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Zurück</span>
        </button>
      </div>
      <span
        className={`tag text-xs inline-block mb-2 uppercase tracking-wider px-3 py-1 ${
          exhibitionState === "past"
            ? "bg-stone-200 text-stone-600"
            : exhibitionState === "current"
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {exhibitionState === "past"
          ? "Vergangene Ausstellung"
          : exhibitionState === "current"
          ? "Aktuelle Ausstellung"
          : "Kommende Ausstellung"}
      </span>
      {artist && (
        <p className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-stone-900">
          {artist}
        </p>
      )}
      <h1 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-stone-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-xl text-stone-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
      <p className="mt-4 text-stone-600">{formattedDate}</p>
      <div className="mt-4 flex justify-center space-x-6">
        {artist && (
          <div className="flex items-center text-stone-600">
            <User className="h-4 w-4 mr-1" />
            <span>{artist}</span>
          </div>
        )}
        {contributors && contributors.filter((c) => c.icon === "music").length > 0 && (
          <div className="flex items-center text-stone-600">
            <Music className="h-4 w-4 mr-1" />
            <span>
              {contributors
                .filter((c) => c.icon === "music")
                .map((c) => c.name)
                .join(", ")}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExhibitionDetailHeader;
