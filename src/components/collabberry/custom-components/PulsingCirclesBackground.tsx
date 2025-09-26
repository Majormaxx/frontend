import React from "react";
import { motion } from "framer-motion";

import { useMemo } from "react";

const generateRandomPositions = (count: number) => {
    return [...Array(count)].map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
    }));
};
const PulsingCirclesBackground: React.FC = () => {

    const pulseAnimation = {
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5],
    };

    const animations = (x: number, y: number) => ({
        ...pulseAnimation,
        x: [x, Math.random() * window.innerWidth],
        y: [y, Math.random() * window.innerHeight],
    });

    const positions = useMemo(() => generateRandomPositions(12), []);
    const animate = useMemo(() => positions.map(pos => animations(pos.x, pos.y)), []);


    return (
        <div className="z-index-0 relative h-full w-full overflow-hidden bg-[#1C4043]">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-48 w-48 rounded-full bg-[#F2907A] opacity-50"
                    style={{ filter: "blur(50px)" }}
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

export default PulsingCirclesBackground;
