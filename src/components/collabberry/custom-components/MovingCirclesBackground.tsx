import React from "react";
import { motion } from "framer-motion";

import { useMemo } from "react";

const generateRandomPositions = (count: number) => {
  return [...Array(count)].map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  }));
};

const MovingCirclesBackground: React.FC = () => {
  const animate = useMemo(() => generateRandomPositions(12), []);
  const positions = useMemo(() => generateRandomPositions(12), []);

  return (
    <div className="z-index-0 relative h-full w-full overflow-hidden bg-[#1C4043]">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-96 w-96 rounded-full bg-[#F2907A] opacity-50"
          style={{ filter: "blur(10px)" }}
          initial={positions[i]}
          animate={animate[i]}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default MovingCirclesBackground;
