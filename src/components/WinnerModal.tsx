import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WinnerModalProps {
  isOpen: boolean;
  winner: string | null;
  onClose: () => void;
  onRemove: () => void;
}

export const WinnerModal = ({ isOpen, winner, onClose, onRemove }: WinnerModalProps) => {
  if (!winner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-accent">
        <DialogHeader className="bg-accent/20 -m-6 mb-4 p-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-accent text-center">
            🎉 We have a winner!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-8">
          <div className="text-4xl font-bold text-foreground mb-2">
            {winner}
          </div>
          <div className="text-lg text-muted-foreground">
            Congratulations! 🏆
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6"
          >
            Close
          </Button>
          <Button 
            onClick={onRemove}
            className="px-6 bg-accent hover:bg-accent/90"
          >
            Remove from wheel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};