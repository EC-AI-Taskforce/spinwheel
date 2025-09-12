import { WheelOfNamesApp } from "@/components/WheelOfNamesApp";
import { WheelEntry } from "@/components/SpinningWheel";

interface IndexProps {
  entries: WheelEntry[];
  setEntries: (entries: WheelEntry[]) => void;
  soundEnabled: boolean;
  spinDuration: number;
}

const Index = ({ entries, setEntries, soundEnabled, spinDuration }: IndexProps) => {
  return <WheelOfNamesApp 
    entries={entries}
    setEntries={setEntries}
    soundEnabled={soundEnabled}
    spinDuration={spinDuration}
  />;
};

export default Index;