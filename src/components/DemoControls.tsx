import { useState } from 'react';
import { StoreStats } from '@/types/store';
import { Plus, Zap, Timer, BarChart3, Clock, CheckSquare, User, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'framer-motion';

interface DemoControlsProps {
  stats: StoreStats;
  onAddOrder: (customerName?: string) => void;
  onSpeedUp: () => void;
  onSimulateDelay: () => void;
}

const DemoControls = ({ stats, onAddOrder, onSpeedUp, onSimulateDelay }: DemoControlsProps) => {
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOrder = () => {
    setIsSubmitting(true);
    onAddOrder(customerName.trim() || undefined);
    setCustomerName('');
    setTimeout(() => setIsSubmitting(false), 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddOrder();
    }
  };

  return (
    <motion.div 
      className="bg-card rounded-2xl shadow-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-2.5 bg-primary/10 rounded-xl"
          whileHover={{ scale: 1.1, rotate: 15 }}
        >
          <BarChart3 className="w-6 h-6 text-primary" />
        </motion.div>
        <div>
          <h2 className="text-lg font-bold">Demo Controls</h2>
          <p className="text-sm text-muted-foreground">Simulate store scenarios for judging</p>
        </div>
      </div>

      {/* Customer Order Input */}
      <div className="mb-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
        <label className="text-sm font-medium mb-2 flex items-center gap-2">
          <User className="w-4 h-4" />
          Add Customer Order
        </label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Customer name (optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleAddOrder} 
              className="gap-2 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4" />
              Order
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => onAddOrder()} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Quick Add
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onSpeedUp} variant="secondary" className="gap-2">
            <Zap className="w-4 h-4" />
            Speed Up
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onSimulateDelay} variant="destructive" className="gap-2">
            <Timer className="w-4 h-4" />
            Simulate Delay
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          className="p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CheckSquare className="w-4 h-4 text-success" />
            Completed Today
          </div>
          <motion.p 
            className="text-3xl font-extrabold text-success tabular-nums"
            key={stats.completed}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {stats.completed}
          </motion.p>
          <p className="text-xs text-muted-foreground mt-1">Orders fulfilled</p>
        </motion.div>
        <motion.div 
          className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4 text-primary" />
            Avg Prep Time
          </div>
          <p className="text-3xl font-extrabold tabular-nums">
            {stats.avgPrep.toFixed(1)}
            <span className="text-lg font-bold text-muted-foreground ml-1">min</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Moving average</p>
        </motion.div>
      </div>

      <motion.div 
        className="p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          💡 Hackathon Demo Tip
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Switch to <strong className="text-primary">Rush Hour</strong> mode, add 2–3 orders with custom names, 
          then show how the queue prediction increases and the pickup cubbies guide customers to reduce counter congestion.
          Click on ready cubbies to simulate customer pickups!
        </p>
      </motion.div>

      <motion.div 
        className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="font-semibold text-sm mb-2">🔬 How "Sensors + AI" Works</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          <strong>Real store version:</strong> Queue prediction uses POS order timestamps, barista station updates, 
          footfall sensors, and machine learning models trained on historical data.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>This prototype:</strong> Simulates those signals in real-time to demonstrate how 
          in-store displays improve customer flow and reduce counter congestion.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DemoControls;
