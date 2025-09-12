import { useState } from 'react';
import { Trash2, Plus, Edit3, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { WheelSettings } from '@/components/WheelSettings';
import { WheelEntry } from '@/components/SpinningWheel';

interface AdminProps {
  entries: WheelEntry[];
  setEntries: (entries: WheelEntry[]) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  spinDuration: number;
  setSpinDuration: (duration: number) => void;
  winner: string | null;
  isSpinning: boolean;
}

export const Admin = ({
  entries,
  setEntries,
  soundEnabled,
  setSoundEnabled,
  spinDuration,
  setSpinDuration,
  winner,
  isSpinning
}: AdminProps) => {
  const [newEntryName, setNewEntryName] = useState('');
  const [newEntryColor, setNewEntryColor] = useState('#008080');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('');

  const colors = [
    // Blues
    '#008080', '#000080', '#4169E1', '#1E3A8A', '#191970', '#5F9EA0', '#6495ED', '#4682B4', '#0066CC', '#003366',
    // Teals & Cyans
    '#4ECDC4', '#20B2AA', '#48CAE4', '#87CEEB', '#40E0D0', '#00CED1', '#5F9EA0', '#008B8B', '#2E8B57', '#006666',
    // Greens
    '#228B22', '#32CD32', '#00FF7F', '#98FB98', '#90EE90', '#00FA9A', '#3CB371', '#2E8B57', '#008000', '#006400',
    // Yellows & Oranges
    '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#FFA07A', '#FFFF00', '#ADFF2F', '#9ACD32', '#DAA520',
    // Reds & Pinks
    '#FF6B6B', '#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#DC143C', '#B22222', '#8B0000', '#CD5C5C', '#F08080',
    // Purples
    '#8A2BE2', '#9370DB', '#BA55D3', '#DDA0DD', '#EE82EE', '#DA70D6', '#FF00FF', '#C71585', '#9932CC', '#4B0082',
    // Grays & Neutrals
    '#FFFFFF', '#F8F9FA', '#F1F5F9', '#E6E6FA', '#DCDCDC', '#D3D3D3', '#C0C0C0', '#A9A9A9', '#808080', '#696969',
    // Dark Colors
    '#2C3E50', '#34495E', '#2F4F4F', '#36454F', '#708090', '#778899', '#2F2F2F', '#1C1C1C', '#000000', '#191970'
  ];

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
      color: newEntryColor,
    };

    setEntries([...entries, newEntry]);
    setNewEntryName('');
    setNewEntryColor(colors[(entries.length + 1) % colors.length]);
    toast.success('Entry added!');
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast.success('Entry removed!');
  };

  const startEdit = (entry: WheelEntry) => {
    setEditingId(entry.id);
    setEditingName(entry.name);
    setEditingColor(entry.color);
  };

  const saveEdit = () => {
    if (!editingName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setEntries(entries.map(entry => 
      entry.id === editingId 
        ? { ...entry, name: editingName.trim(), color: editingColor }
        : entry
    ));
    setEditingId(null);
    setEditingName('');
    setEditingColor('');
    toast.success('Entry updated!');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingColor('');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Wheel
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              🔧 Admin Panel
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Manage your wheel entries and settings
          </p>
        </div>

        {/* Management Section */}
        <Card className="p-6 bg-card border-border shadow-card">
          <Tabs defaultValue="entries" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="entries">Manage Entries ({entries.length})</TabsTrigger>
              <TabsTrigger value="settings">Wheel Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="entries" className="mt-6">
              {/* Add Entry */}
              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
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
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Color:</label>
                  <input
                    type="color"
                    value={newEntryColor}
                    onChange={(e) => setNewEntryColor(e.target.value)}
                    className="w-10 h-8 rounded border border-border cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewEntryColor(color)}
                        className="w-6 h-6 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
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
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
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
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground">Color:</label>
                          <input
                            type="color"
                            value={editingColor}
                            onChange={(e) => setEditingColor(e.target.value)}
                            className="w-6 h-6 rounded border border-border cursor-pointer"
                          />
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => setEditingColor(color)}
                                className="w-4 h-4 rounded border border-white shadow-sm hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
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
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <WheelSettings
                soundEnabled={soundEnabled}
                onSoundToggle={setSoundEnabled}
                spinDuration={spinDuration}
                onSpinDurationChange={setSpinDuration}
              />
            </TabsContent>
          </Tabs>
        </Card>

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
    </div>
  );
};