
import { useEffect, useRef, useState } from 'react';
import { Heart, Stethoscope, Pill, Thermometer, Activity, Clipboard, BandageIcon } from 'lucide-react';

// Define the types of medical icons available
const medicalIcons = [
  { component: Heart, color: 'rgba(236, 72, 153, 0.7)' },  // Pink heart
  { component: Stethoscope, color: 'rgba(79, 70, 229, 0.7)' }, // Purple stethoscope
  { component: Pill, color: 'rgba(16, 185, 129, 0.7)' }, // Green pill
  { component: Thermometer, color: 'rgba(245, 158, 11, 0.7)' }, // Amber thermometer
  { component: Activity, color: 'rgba(99, 102, 241, 0.7)' }, // Indigo activity
  { component: Clipboard, color: 'rgba(59, 130, 246, 0.7)' }, // Blue clipboard
  { component: BandageIcon, color: 'rgba(239, 68, 68, 0.7)' }, // Red bandage (replacing FirstAid)
];

interface FloatingIcon {
  id: number;
  icon: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  direction: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
}

const MedicalAnimatedBackground = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);
  const animationRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize floating icons
  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    // Create 15-25 floating icons
    const iconCount = 15 + Math.floor(Math.random() * 10);
    const newIcons: FloatingIcon[] = [];
    
    for (let i = 0; i < iconCount; i++) {
      newIcons.push({
        id: i,
        icon: Math.floor(Math.random() * medicalIcons.length),
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
        size: 20 + Math.random() * 30, // Size between 20-50px
        opacity: 0.1 + Math.random() * 0.5, // Opacity between 0.1-0.6
        speed: 0.2 + Math.random() * 0.5, // Speed of movement
        direction: {
          x: (Math.random() - 0.5) * 2, // Random direction (-1 to 1)
          y: (Math.random() - 0.5) * 2  // Random direction (-1 to 1)
        },
        rotation: Math.random() * 360, // Initial rotation (0-360 degrees)
        rotationSpeed: (Math.random() - 0.5) * 2 // Rotation speed and direction
      });
    }
    
    setIcons(newIcons);
    
    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        const newHeight = containerRef.current.offsetHeight;
        
        setIcons(prevIcons => prevIcons.map(icon => ({
          ...icon,
          x: (icon.x / containerWidth) * newWidth, // Scale position to new dimensions
          y: (icon.y / containerHeight) * newHeight
        })));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animate icons
  useEffect(() => {
    if (!containerRef.current || icons.length === 0) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    const animate = () => {
      setIcons(prevIcons => prevIcons.map(icon => {
        // Calculate new position
        let newX = icon.x + icon.direction.x * icon.speed;
        let newY = icon.y + icon.direction.y * icon.speed;
        let newDirection = { ...icon.direction };
        
        // Bounce off the edges
        if (newX <= 0 || newX >= containerWidth - icon.size) {
          newDirection.x = -newDirection.x;
          newX = Math.max(0, Math.min(newX, containerWidth - icon.size));
        }
        
        if (newY <= 0 || newY >= containerHeight - icon.size) {
          newDirection.y = -newDirection.y;
          newY = Math.max(0, Math.min(newY, containerHeight - icon.size));
        }
        
        // Update rotation
        const newRotation = (icon.rotation + icon.rotationSpeed) % 360;
        
        return {
          ...icon,
          x: newX,
          y: newY,
          direction: newDirection,
          rotation: newRotation
        };
      }));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [icons]);
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {icons.map((icon) => {
        const IconComponent = medicalIcons[icon.icon].component;
        const iconColor = medicalIcons[icon.icon].color;
        
        return (
          <div
            key={icon.id}
            className="absolute transition-transform"
            style={{
              left: `${icon.x}px`,
              top: `${icon.y}px`,
              transform: `rotate(${icon.rotation}deg)`,
              opacity: icon.opacity,
            }}
          >
            <IconComponent 
              size={icon.size} 
              color={iconColor}
              strokeWidth={1.5}
              className="filter blur-[0.5px]"
            />
          </div>
        );
      })}
    </div>
  );
};

export default MedicalAnimatedBackground;
