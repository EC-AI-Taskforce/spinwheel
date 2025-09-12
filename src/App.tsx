import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Admin } from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { WheelEntry } from "./components/SpinningWheel";

const queryClient = new QueryClient();

const App = () => {
  const [entries, setEntries] = useState<WheelEntry[]>([
    { id: '1', name: 'Alice', color: '#008080' },      // Teal
    { id: '2', name: 'Bob', color: '#000080' },        // Navy Blue
    { id: '3', name: 'Charlie', color: '#FFFFFF' },    // White
    { id: '4', name: 'Diana', color: '#4ECDC4' },      // Light Teal
    { id: '5', name: 'Eve', color: '#2C3E50' },        // Dark Blue
    { id: '6', name: 'Frank', color: '#F8F9FA' },      // Light Gray
  ]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spinDuration, setSpinDuration] = useState(6);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <Index 
                  entries={entries}
                  setEntries={setEntries}
                  soundEnabled={soundEnabled}
                  spinDuration={spinDuration}
                />
              } 
            />
            <Route 
              path="/admin" 
              element={
                <Admin 
                  entries={entries} 
                  setEntries={setEntries} 
                  soundEnabled={soundEnabled} 
                  setSoundEnabled={setSoundEnabled} 
                  spinDuration={spinDuration} 
                  setSpinDuration={setSpinDuration} 
                  winner={null} 
                  isSpinning={false} 
                />
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;