import { useState } from 'react';
import { Settings, Volume2, VolumeX, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface WheelSettingsProps {
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
  spinDuration: number;
  onSpinDurationChange: (duration: number) => void;
}

export const WheelSettings = ({
  soundEnabled,
  onSoundToggle,
  spinDuration,
  onSpinDurationChange,
}: WheelSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-4 bg-card border-border shadow-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <span className="font-semibold">Wheel Settings</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {isOpen ? 'Hide' : 'Show'}
            </span>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-toggle" className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Sound Effects
            </Label>
            <Switch
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={onSoundToggle}
            />
          </div>

          {/* Spin Duration */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Spin Duration
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 4, 5].map((duration) => (
                <Button
                  key={duration}
                  variant={spinDuration === duration ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSpinDurationChange(duration)}
                >
                  {duration}s
                </Button>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};