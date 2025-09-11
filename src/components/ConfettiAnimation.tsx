import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  size: number;
}

interface ConfettiAnimationProps {
  isActive: boolean;
  duration?: number;
}

export const ConfettiAnimation = ({ isActive, duration = 3000 }: ConfettiAnimationProps) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  
  const colors = [
    'bg-confetti-1',
    'bg-confetti-2', 
    'bg-confetti-3',
    'bg-confetti-4',
    'bg-confetti-5',
  ];

  useEffect(() => {
    if (!isActive) {
      setConfetti([]);
      return;
    }

    // Generate confetti pieces
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1000,
        size: Math.random() * 8 + 4,
      });
    }
    setConfetti(pieces);

    // Clear confetti after duration
    const timeout = setTimeout(() => {
      setConfetti([]);
    }, duration);

    return () => clearTimeout(timeout);
  }, [isActive, duration]);

  if (!isActive || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className={`absolute ${piece.color} rounded-sm animate-confetti-fall`}
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}ms`,
          }}
        />
      ))}
    </div>
  );
};