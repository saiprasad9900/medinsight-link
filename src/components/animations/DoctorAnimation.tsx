
import { useEffect, useRef } from "react";

const DoctorAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);

    // Doctor and patient figures
    interface Figure {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      isDoctor: boolean;
      targetX?: number;
      targetY?: number;
    }

    // Generate random figures
    const figures: Figure[] = [];
    const totalFigures = 8; // Number of figures to show (2 doctors, 6 patients)
    
    for (let i = 0; i < totalFigures; i++) {
      const isDoctor = i < 2; // First 2 are doctors, rest are patients
      figures.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isDoctor ? 20 : 15,
        color: isDoctor ? "#4f46e5" : "#64748b", // Purple for doctors, gray for patients
        speed: 0.5 + Math.random() * 1.5,
        isDoctor,
      });
    }

    // Animation variables
    let animationFrameId: number;
    
    // Draw doctor figure
    const drawDoctor = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      // Head
      ctx.beginPath();
      ctx.arc(x, y - size / 2, size / 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Body
      ctx.beginPath();
      ctx.moveTo(x, y - size / 3);
      ctx.lineTo(x, y + size / 3);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Arms
      ctx.beginPath();
      ctx.moveTo(x, y - size / 6);
      ctx.lineTo(x - size / 2, y);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x, y - size / 6);
      ctx.lineTo(x + size / 2, y);
      ctx.stroke();
      
      // Legs
      ctx.beginPath();
      ctx.moveTo(x, y + size / 3);
      ctx.lineTo(x - size / 3, y + size);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x, y + size / 3);
      ctx.lineTo(x + size / 3, y + size);
      ctx.stroke();
      
      // Doctor's stethoscope (only for doctors)
      if (color === "#4f46e5") {
        ctx.beginPath();
        ctx.moveTo(x + size / 4, y - size / 6);
        ctx.lineTo(x + size / 4, y + size / 4);
        ctx.arc(x + size / 8, y + size / 4, size / 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // Draw patient figure
    const drawPatient = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      // Similar to doctor but without stethoscope
      // Head
      ctx.beginPath();
      ctx.arc(x, y - size / 2, size / 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Body
      ctx.beginPath();
      ctx.moveTo(x, y - size / 3);
      ctx.lineTo(x, y + size / 3);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Arms
      ctx.beginPath();
      ctx.moveTo(x, y - size / 6);
      ctx.lineTo(x - size / 2, y);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x, y - size / 6);
      ctx.lineTo(x + size / 2, y);
      ctx.stroke();
      
      // Legs
      ctx.beginPath();
      ctx.moveTo(x, y + size / 3);
      ctx.lineTo(x - size / 3, y + size);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x, y + size / 3);
      ctx.lineTo(x + size / 3, y + size);
      ctx.stroke();
    };

    // Update figure positions and interactions
    const updateFigures = () => {
      for (const figure of figures) {
        // If figure doesn't have a target, assign one
        if (!figure.targetX || !figure.targetY) {
          figure.targetX = Math.random() * canvas.width;
          figure.targetY = Math.random() * canvas.height;
        }
        
        // Move towards target
        const dx = (figure.targetX - figure.x);
        const dy = (figure.targetY - figure.y);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If close to target, get a new one
        if (distance < 50) {
          figure.targetX = Math.random() * canvas.width;
          figure.targetY = Math.random() * canvas.height;
        } else {
          // Move towards target
          figure.x += (dx / distance) * figure.speed;
          figure.y += (dy / distance) * figure.speed;
        }

        // If doctor, occasionally move towards a patient
        if (figure.isDoctor && Math.random() < 0.02) {
          const patients = figures.filter(f => !f.isDoctor);
          if (patients.length > 0) {
            const randomPatient = patients[Math.floor(Math.random() * patients.length)];
            figure.targetX = randomPatient.x;
            figure.targetY = randomPatient.y;
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update positions
      updateFigures();
      
      // Draw figures
      for (const figure of figures) {
        if (figure.isDoctor) {
          drawDoctor(ctx, figure.x, figure.y, figure.size, figure.color);
        } else {
          drawPatient(ctx, figure.x, figure.y, figure.size, figure.color);
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-5"
      aria-hidden="true"
    />
  );
};

export default DoctorAnimation;
