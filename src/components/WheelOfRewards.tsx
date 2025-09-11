import { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, Edit3, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface WheelEntry {
  id: string;
  name: string;
  color: string;
}

export const WheelOfRewards = () => {
  const [entries, setEntries] = useState<WheelEntry[]>([
    { id: '1', name: 'Alice', color: '#FF6B6B' },
    { id: '2', name: 'Bob', color: '#4ECDC4' },
    { id: '3', name: 'Charlie', color: '#45B7D1' },
    { id: '4', name: 'Diana', color: '#96CEB4' },
    { id: '5', name: 'Eve', color: '#FFEAA7' },
    { id: '6', name: 'Frank', color: '#DDA0DD' },
  ]);
  
  const [newEntryName, setNewEntryName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [spinRotation, setSpinRotation] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  
  const wheelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84',
    '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E'
  ];

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
      ctx.fillText(entry.name, radius * 0.7, 5);
      ctx.restore();
    });
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

    setIsSpinning(true);
    setWinner(null);
    
    // Random rotation between 1800 and 3600 degrees
    const randomRotation = 1800 + Math.random() * 1800;
    setSpinRotation(prev => prev + randomRotation);
    
    // Calculate winner after spin
    setTimeout(() => {
      const normalizedRotation = (spinRotation + randomRotation) % 360;
      const sliceAngle = 360 / entries.length;
      const winnerIndex = Math.floor(((360 - normalizedRotation + sliceAngle / 2) % 360) / sliceAngle);
      const selectedWinner = entries[winnerIndex];
      
      setWinner(selectedWinner.name);
      setIsSpinning(false);
      
      // Celebration
      toast.success(`🎉 ${selectedWinner.name} wins!`, {
        duration: 5000,
      });
    }, 4000);
  };

  const resetWheel = () => {
    setSpinRotation(0);
    setWinner(null);
    setIsSpinning(false);
    toast.success('Wheel reset!');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            🎯 Wheel of Rewards
          </h1>
          <p className="text-xl text-muted-foreground">
            Add names, spin the wheel, and discover your winner!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Wheel Section */}
          <div className="flex flex-col items-center space-y-6">
            <Card className="p-8 bg-card border-border shadow-card">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className={`transition-transform duration-[4000ms] ease-out ${
                    isSpinning ? 'animate-pulse-glow' : ''
                  }`}
                  style={{
                    transform: `rotate(${spinRotation}deg)`,
                  }}
                />
                
                {/* Center pin */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-6 bg-gradient-secondary rounded-full border-4 border-background shadow-lg"></div>
                </div>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-secondary"></div>
                </div>
              </div>
              
              {winner && (
                <div className="mt-6 text-center animate-bounce-in">
                  <div className="bg-gradient-secondary p-4 rounded-xl shadow-winner animate-winner-glow">
                    <h3 className="text-2xl font-bold text-secondary-foreground">
                      🏆 Winner: {winner}
                    </h3>
                  </div>
                </div>
              )}
            </Card>

            {/* Spin Controls */}
            <div className="flex gap-4">
              <Button
                onClick={spinWheel}
                disabled={isSpinning || entries.length === 0}
                size="lg"
                variant="gradient"
                className="font-bold px-8 py-4 text-lg"
              >
                {isSpinning ? '🌪️ Spinning...' : '🎲 SPIN THE WHEEL'}
              </Button>
              
              <Button
                onClick={resetWheel}
                variant="outline"
                size="lg"
                disabled={isSpinning}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
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
                <Button onClick={addEntry} variant="gradient-accent">
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
          </div>
        </div>
      </div>
    </div>
  );
};