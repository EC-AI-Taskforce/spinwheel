import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { SpinningWheel, WheelEntry, SpinningWheelRef } from './SpinningWheel';
import { WinnerModal } from './WinnerModal';
import { ConfettiAnimation } from './ConfettiAnimation';

interface WheelOfNamesAppProps {
  entries: WheelEntry[];
  setEntries: (entries: WheelEntry[]) => void;
  soundEnabled: boolean;
  spinDuration: number;
}

export const WheelOfNamesApp = ({ 
  entries, 
  setEntries, 
  soundEnabled, 
  spinDuration 
}: WheelOfNamesAppProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const wheelRef = useRef<SpinningWheelRef>(null);

  // Keyboard shortcut for spinning
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        spinWheel();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [entries.length, isSpinning]);

  // Play sound effect
  const playSound = () => {
    if (!soundEnabled) return;
    
    // Create a simple celebratory sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const removeWinnerEntry = () => {
    if (winner) {
      setEntries(entries.filter(entry => entry.name !== winner));
      setShowWinnerModal(false);
      setWinner(null);
      toast.success(`${winner} removed from wheel!`);
    }
  };

  const spinWheel = () => {
    if (entries.length === 0) {
      toast.error('Add some entries first!');
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);
    
    // Random rotation between 1800 and 3600 degrees + current rotation
    const randomRotation = 1800 + Math.random() * 1800;
    const newRotation = spinRotation + randomRotation;
    setSpinRotation(newRotation);
    
    // Trigger wheel spin animation
    wheelRef.current?.triggerSpin(newRotation);
    
    // Calculate winner after spin
    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      const sliceAngle = 360 / entries.length;
      const winnerIndex = Math.floor(((360 - normalizedRotation + sliceAngle / 2) % 360) / sliceAngle);
      const selectedWinner = entries[winnerIndex];
      
      setWinner(selectedWinner.name);
      setIsSpinning(false);
      
      // Show modal and effects after a brief delay to ensure spin is complete
      setTimeout(() => {
        setShowWinnerModal(true);
        setShowConfetti(true);
        
        // Play celebration sound
        playSound();
        
        // Hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);
      }, 100);
      
    }, spinDuration * 1000);
  };

  const resetWheel = () => {
    setSpinRotation(0);
    setWinner(null);
    setIsSpinning(false);
    setShowWinnerModal(false);
    setShowConfetti(false);
    if (wheelRef.current) {
      wheelRef.current.triggerSpin(0);
    }
    toast.success('Wheel reset!');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            🎯 Wheel of Names
          </h1>
          <p className="text-xl text-muted-foreground">
            Add names, spin the wheel, and discover your winner!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + Enter</kbd> to spin
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Wheel Section */}
          <div className="flex flex-col items-center space-y-6">
            <Card className="p-8 bg-card border-border shadow-card">
              <SpinningWheel
                ref={wheelRef}
                entries={entries}
                isSpinning={isSpinning}
                spinRotation={spinRotation}
                winner={winner}
              />
            </Card>

            {/* Spin Controls */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <Button
                onClick={spinWheel}
                disabled={isSpinning || entries.length === 0}
                size="lg"
                className="font-bold px-8 py-4 text-lg bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                {isSpinning ? '🌪️ Spinning...' : '🎲 SPIN THE WHEEL'}
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={resetWheel}
                  variant="outline"
                  size="lg"
                  disabled={isSpinning}
                  className="flex-1"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Link Section */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <Card className="p-8 bg-card border-border shadow-card text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Manage Your Wheel
              </h2>
              <p className="text-muted-foreground mb-6">
                Add, edit, or remove entries and customize wheel settings
              </p>
              <Link to="/admin">
                <Button size="lg" className="bg-gradient-accent hover:opacity-90 px-8 py-4">
                  <Settings className="w-5 h-5 mr-2" />
                  Go to Admin Panel
                </Button>
              </Link>
            </Card>
            
            {/* Current Entries Summary */}
            <Card className="p-6 bg-card border-border shadow-card w-full">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Current Entries ({entries.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div
                      className="w-3 h-3 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-foreground">{entry.name}</span>
                  </div>
                ))}
                {entries.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No entries yet. Go to Admin Panel to add some!
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="flex items-center justify-center gap-2">
              🌱 <span>Powered by renewable energy</span>
            </p>
            <p>
              This website is committed to protecting your privacy and complies with GDPR and CCPA regulations. 
              No personal data is collected or stored. All wheel entries are kept locally in your browser.
            </p>
            <p className="text-xs">
              © 2024 Wheel of Names - Fair, Random, and Secure
            </p>
          </div>
        </footer>
      </div>

      {/* Winner Modal */}
      <WinnerModal
        isOpen={showWinnerModal}
        winner={winner}
        onClose={() => setShowWinnerModal(false)}
        onRemove={removeWinnerEntry}
      />

      {/* Confetti Animation */}
      <ConfettiAnimation isActive={showConfetti} />
    </div>
  );
};