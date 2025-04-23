
import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface ExhibitionDetailProgramProps {
  programByDate: {
    date: string;
    events: {
      title: string;
      startTime: string;
      endTime?: string;
      description?: string;
    }[];
  }[];
}

const ExhibitionDetailProgram: React.FC<ExhibitionDetailProgramProps> = ({
  programByDate,
}) => {
  if (!programByDate || programByDate.length === 0) return null;
  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programByDate.map((dayGroup, dayIndex) => (
          <div
            key={dayIndex}
            className="bg-white rounded-lg border-2 border-stone-400 shadow-sm p-6 space-y-4"
          >
            <h3 className="text-lg font-medium text-stone-800 border-b border-stone-200 pb-2 mb-4">
              {dayGroup.date}
            </h3>
            <div className="space-y-6">
              {dayGroup.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="border-l-2 border-stone-300 pl-4 py-2"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center text-stone-700 font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {event.startTime}
                        {event.endTime ? ` - ${event.endTime}` : ""}
                      </span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-lg font-medium">{event.title}</h3>
                      {event.description && (
                        <div className="mt-1 text-stone-600">
                          {event.description.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExhibitionDetailProgram;
