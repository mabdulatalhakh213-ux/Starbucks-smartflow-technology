import { Cubby } from '@/types/store';
import { Package, Snowflake, Flame, Sun, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PickupCubbiesProps {
  cubbies: Cubby[];
  onCubbyClick: (cubbyId: number) => void;
}

const PickupCubbies = ({ cubbies, onCubbyClick }: PickupCubbiesProps) => {
  const getTempIcon = (temp: Cubby['temperature']) => {
    switch (temp) {
      case 'cold': return Snowflake;
      case 'hot': return Flame;
      default: return Sun;
    }
  };

  const getTempColor = (temp: Cubby['temperature']) => {
    switch (temp) {
      case 'cold': return 'text-info';
      case 'hot': return 'text-destructive';
      default: return 'text-warning';
    }
  };

  const getTempBg = (temp: Cubby['temperature']) => {
    switch (temp) {
      case 'cold': return 'from-info/5 to-info/10';
      case 'hot': return 'from-destructive/5 to-destructive/10';
      default: return 'from-warning/5 to-warning/10';
    }
  };

  const readyCubbies = cubbies.filter(c => c.status === 'ready').length;
  const emptyCubbies = cubbies.filter(c => c.status === 'empty').length;

  return (
    <motion.div 
      className="bg-card rounded-2xl shadow-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-2.5 bg-primary/10 rounded-xl"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <Package className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold">Smart Pickup Cubbies</h2>
            <p className="text-sm text-muted-foreground">Temperature-controlled order storage</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
            {readyCubbies} Ready
          </span>
          <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-bold">
            {emptyCubbies} Available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        <AnimatePresence mode="popLayout">
          {cubbies.map((cubby, index) => {
            const TempIcon = getTempIcon(cubby.temperature);
            const tempColor = getTempColor(cubby.temperature);
            const tempBg = getTempBg(cubby.temperature);
            const isReady = cubby.status === 'ready';
            
            return (
              <motion.button
                key={cubby.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => isReady && onCubbyClick(cubby.id)}
                disabled={!isReady}
                className={cn(
                  "relative aspect-square rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 p-2",
                  `bg-gradient-to-br ${tempBg}`,
                  isReady && "border-success cursor-pointer hover:shadow-lg hover:scale-105",
                  cubby.status === 'waiting' && "border-warning",
                  cubby.status === 'empty' && "border-border opacity-60 cursor-default"
                )}
                whileHover={isReady ? { scale: 1.08 } : undefined}
                whileTap={isReady ? { scale: 0.95 } : undefined}
              >
                <span className="text-xs font-bold text-muted-foreground">#{cubby.id}</span>
                
                <TempIcon className={cn("w-4 h-4", tempColor)} />
                
                {isReady && (
                  <motion.div 
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-success rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <CheckCircle className="w-3 h-3 text-success-foreground" />
                  </motion.div>
                )}
                
                {cubby.orderName && (
                  <motion.span 
                    className="text-[10px] font-bold text-foreground truncate max-w-full px-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {cubby.orderName}
                  </motion.span>
                )}
                
                {isReady && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-success"
                    animate={{ 
                      boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0)', '0 0 0 6px rgba(34, 197, 94, 0.3)', '0 0 0 0 rgba(34, 197, 94, 0)'] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Snowflake className="w-3.5 h-3.5 text-info" />
          <span>Cold (38°F)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-destructive" />
          <span>Hot (145°F)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-warning" />
          <span>Ambient</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
          <span>Click to pickup</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PickupCubbies;
