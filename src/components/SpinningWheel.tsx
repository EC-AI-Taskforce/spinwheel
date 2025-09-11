import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface WheelEntry {
  id: string;
  name: string;
  color: string;
}

interface SpinningWheelProps {
  entries: WheelEntry[];
  isSpinning: boolean;
  spinRotation: number;
  winner: string | null;
  onAnimationComplete?: () => void;
}

export interface SpinningWheelRef {
  triggerSpin: (rotation: number) => void;
}

export const SpinningWheel = forwardRef<SpinningWheelRef, SpinningWheelProps>(
  ({ entries, isSpinning, spinRotation, winner, onAnimationComplete }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      triggerSpin: (rotation: number) => {
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${rotation}deg)`;
          wheelRef.current.style.transition = 'transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          
          // Reset transition after animation
          setTimeout(() => {
            if (wheelRef.current) {
              wheelRef.current.style.transition = '';
              onAnimationComplete?.();
            }
          }, 6000);
        }
      },
    }));

    useEffect(() => {
      drawWheel();
    }, [entries, winner]);

    const drawWheel = () => {
      const canvas = canvasRef.current;
      if (!canvas || entries.length === 0) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;
      const sliceAngle = (2 * Math.PI) / entries.length;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      entries.forEach((entry, index) => {
        const startAngle = index * sliceAngle - Math.PI / 2;
        const endAngle = startAngle + sliceAngle;

        // Draw slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = entry.color;
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Highlight winner
        if (winner === entry.name) {
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 20;
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 6;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(entry.name, radius * 0.7, 0);
        ctx.restore();
      });
    };

    if (entries.length === 0) {
      return (
        <div className="w-[400px] h-[400px] flex items-center justify-center bg-muted rounded-full border-4 border-dashed border-muted-foreground">
          <p className="text-muted-foreground text-center">
            Add entries to see the wheel
          </p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div
          ref={wheelRef}
          className={`${isSpinning ? 'animate-pulse-glow' : ''}`}
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="drop-shadow-lg"
          />
        </div>
        
        {/* Center pin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 bg-gradient-secondary rounded-full border-4 border-background shadow-lg z-10"></div>
        </div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[30px] border-l-transparent border-r-transparent border-t-accent drop-shadow-md"></div>
        </div>
      </div>
    );
  }
);