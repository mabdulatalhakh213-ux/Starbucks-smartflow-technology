import { StoreStats } from '@/types/store';
import { Plus, Zap, Timer, BarChart3, Clock, CheckSquare } from 'lucide-react';
import { Button } from './ui/button';

interface DemoControlsProps {
  stats: StoreStats;
  onAddOrder: () => void;
  onSpeedUp: () => void;
  onSimulateDelay: () => void;
}

const DemoControls = ({ stats, onAddOrder, onSpeedUp, onSimulateDelay }: DemoControlsProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-card p-6 animate-slide-up stagger-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Demo Controls</h2>
          <p className="text-sm text-muted-foreground">Simulate store scenarios for judging</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={onAddOrder} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Order
        </Button>
        <Button onClick={onSpeedUp} variant="secondary" className="gap-2">
          <Zap className="w-4 h-4" />
          Speed Up
        </Button>
        <Button onClick={onSimulateDelay} variant="destructive" className="gap-2">
          <Timer className="w-4 h-4" />
          Simulate Delay
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CheckSquare className="w-4 h-4" />
            Completed Today
          </div>
          <p className="text-3xl font-extrabold">{stats.completed}</p>
          <p className="text-xs text-muted-foreground mt-1">Orders fulfilled</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            Avg Prep Time
          </div>
          <p className="text-3xl font-extrabold">{stats.avgPrep.toFixed(1)}<span className="text-lg font-bold text-muted-foreground ml-1">min</span></p>
          <p className="text-xs text-muted-foreground mt-1">Moving average</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <h3 className="font-semibold text-sm mb-2">💡 Hackathon Tip</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Switch to <strong>Rush Hour</strong> mode, add 2–3 orders, then show how the queue prediction increases and the pickup cubbies guide customers to reduce counter congestion.
        </p>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
        <h3 className="font-semibold text-sm mb-2">How "Sensors + AI" Works</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          <strong>Real store version:</strong> Queue prediction uses POS order timestamps, barista station updates, and footfall sensors with machine learning.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>This prototype:</strong> Simulates those signals to demonstrate how in-store displays improve flow and reduce crowding.
        </p>
      </div>
    </div>
  );
};

export default DemoControls;
