
import React, { useRef, useEffect } from "react";

interface RobotAvatarProps {
  speaking?: boolean;
}

const RobotAvatar: React.FC<RobotAvatarProps> = ({ speaking = false }) => {
  // We'll animate the mouth based on the speaking prop
  const mouthRef = useRef<SVGRectElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (speaking && mouthRef.current) {
      // Animate the mouth height randomly while "speaking"
      interval = setInterval(() => {
        if (mouthRef.current) {
          mouthRef.current.setAttribute(
            "height",
            `${12 + Math.random() * 10}`
          );
        }
      }, 120);
    } else if (mouthRef.current) {
      mouthRef.current.setAttribute("height", "12");
    }
    return () => {
      if (interval) clearInterval(interval);
      if (mouthRef.current) mouthRef.current.setAttribute("height", "12");
    };
  }, [speaking]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <svg width="170" height="180" viewBox="0 0 170 180" className="drop-shadow-lg">
        {/* Robot Head */}
        <ellipse cx="85" cy="90" rx="70" ry="78" fill="#e5e7eb" stroke="#374151" strokeWidth="3"/>
        {/* Eyes */}
        <ellipse cx="60" cy="80" rx="10" ry="10" fill="#374151">
          <animate attributeName="ry" values="10;14;10" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="110" cy="80" rx="10" ry="10" fill="#374151">
          <animate attributeName="ry" values="10;15;10" dur="2.3s" repeatCount="indefinite" />
        </ellipse>
        {/* Mouth */}
        <rect
          ref={mouthRef}
          x="67"
          y="120"
          width="36"
          height="12"
          rx="6"
          fill="#60a5fa"
          stroke="#2563eb"
          strokeWidth="2"
        />
        {/* Antennas */}
        <rect x="80" y="23" width="10" height="24" fill="#d1d5db" />
        <circle cx="85" cy="20" r="8" fill="#60a5fa" stroke="#2563eb" strokeWidth="2"/>
      </svg>
      <span className="mt-3 text-base font-semibold text-primary">Dr. MediPredict</span>
    </div>
  );
};

export default RobotAvatar;
