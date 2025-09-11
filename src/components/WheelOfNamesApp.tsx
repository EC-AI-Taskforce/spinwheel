import { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, Edit3, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SpinningWheel, WheelEntry, SpinningWheelRef } from './SpinningWheel';
import { WinnerModal } from './WinnerModal';
import { ConfettiAnimation } from './ConfettiAnimation';
import { WheelSettings } from './WheelSettings';

export const WheelOfNamesApp = () => {
  const [entries, setEntries] = useState<WheelEntry[]>([
    { id: '1', name: 'Alice', color: '#008080' },      // Teal
    { id: '2', name: 'Bob', color: '#000080' },        // Navy Blue
    { id: '3', name: 'Charlie', color: '#FFFFFF' },    // White
    { id: '4', name: 'Diana', color: '#4ECDC4' },      // Light Teal
    { id: '5', name: 'Eve', color: '#2C3E50' },        // Dark Blue
    { id: '6', name: 'Frank', color: '#F8F9FA' },      // Light Gray
  ]);
  
  const [newEntryName, setNewEntryName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spinDuration, setSpinDuration] = useState(4);
  
  const wheelRef = useRef<SpinningWheelRef>(null);

  const colors = [
    '#008080', '#000080', '#FFFFFF', '#4ECDC4', '#2C3E50', '#F8F9FA',
    '#20B2AA', '#4169E1', '#E6E6FA', '#48CAE4', '#1E3A8A', '#F1F5F9',
    '#5F9EA0', '#6495ED', '#DCDCDC', '#87CEEB', '#191970', '#FFFAFA'
  ];

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

  const addEntry = () => {
    if (!newEntryName.trim()) {
      toast.error('Please enter a name');
      return;
    }
    
    if (entries.some(entry => entry.name.toLowerCase() === newEntryName.toLowerCase())) {
      toast.error('Name already exists');
      return;
    }

    const newEntry: WheelEntry = {
      id: Date.now().toString(),
      name: newEntryName.trim(),
      color: colors[entries.length % colors.length],
    };

    setEntries([...entries, newEntry]);
    setNewEntryName('');
    toast.success('Entry added!');
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast.success('Entry removed!');
  };

  const removeWinnerEntry = () => {
    if (winner) {
      setEntries(entries.filter(entry => entry.name !== winner));
      setShowWinnerModal(false);
      setWinner(null);
      toast.success(`${winner} removed from wheel!`);
    }
  };

  const startEdit = (entry: WheelEntry) => {
    setEditingId(entry.id);
    setEditingName(entry.name);
  };

  const saveEdit = () => {
    if (!editingName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setEntries(entries.map(entry => 
      entry.id === editingId 
        ? { ...entry, name: editingName.trim() }
        : entry
    ));
    setEditingId(null);
    setEditingName('');
    toast.success('Entry updated!');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
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
      setShowWinnerModal(true);
      setShowConfetti(true);
      
      // Play celebration sound
      playSound();
      
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
      
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

          {/* Entries Management */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border shadow-card">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Manage Entries ({entries.length})
              </h2>
              
              {/* Add Entry */}
              <div className="flex gap-2 mb-6">
                <Input
                  value={newEntryName}
                  onChange={(e) => setNewEntryName(e.target.value)}
                  placeholder="Enter a name..."
                  onKeyPress={(e) => e.key === 'Enter' && addEntry()}
                  className="flex-1"
                />
                <Button onClick={addEntry} className="bg-gradient-accent">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Entries List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: entry.color }}
                    />
                    
                    {editingId === entry.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1"
                          autoFocus
                        />
                        <Button onClick={saveEdit} size="sm" variant="outline">
                          Save
                        </Button>
                        <Button onClick={cancelEdit} size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-foreground font-medium">
                          {entry.name}
                        </span>
                        {winner === entry.name && (
                          <Badge className="bg-gradient-secondary animate-pulse">
                            Winner! 🏆
                          </Badge>
                        )}
                        <Button
                          onClick={() => startEdit(entry)}
                          size="sm"
                          variant="ghost"
                          disabled={isSpinning}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeEntry(entry.id)}
                          size="sm"
                          variant="ghost"
                          disabled={isSpinning}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
                
                {entries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No entries yet. Add some names to get started!</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Settings */}
            <WheelSettings
              soundEnabled={soundEnabled}
              onSoundToggle={setSoundEnabled}
              spinDuration={spinDuration}
              onSpinDurationChange={setSpinDuration}
            />
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