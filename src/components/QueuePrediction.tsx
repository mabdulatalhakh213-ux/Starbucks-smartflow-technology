import { StoreStats } from '@/types/store';
import { Clock, Users, TrendingUp, Activity, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface QueuePredictionProps {
  stats: StoreStats;
}

const AnimatedNumber = ({ value, suffix = '' }: { value: number | string; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);
  
  return (
    <motion.span
      key={String(displayValue)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="tabular-nums"
    >
      {displayValue}{suffix}
    </motion.span>
  );
};

const QueuePrediction = ({ stats }: QueuePredictionProps) => {
  const getQueueLevel = (min: number) => {
    if (min <= 4) return { label: 'Low Wait', color: 'bg-success', textColor: 'text-success', emoji: '✨' };
    if (min <= 8) return { label: 'Medium Wait', color: 'bg-warning', textColor: 'text-warning', emoji: '⏳' };
    return { label: 'High Wait', color: 'bg-destructive', textColor: 'text-destructive', emoji: '🔥' };
  };

  const getTrafficLevel = (footfall: number) => {
    if (footfall <= 15) return { label: 'Quiet', color: 'bg-success', emoji: '🌿' };
    if (footfall <= 30) return { label: 'Moderate', color: 'bg-info', emoji: '👥' };
    return { label: 'Busy', color: 'bg-warning', emoji: '🏃' };
  };

  const getLoadLevel = (inProgress: number) => {
    if (inProgress <= 6) return { label: 'Light', color: 'bg-success', emoji: '☕' };
    if (inProgress <= 12) return { label: 'Medium', color: 'bg-warning', emoji: '🔄' };
    return { label: 'Heavy', color: 'bg-destructive', emoji: '⚡' };
  };

  const queueLevel = getQueueLevel(stats.queueMin);
  const trafficLevel = getTrafficLevel(stats.footfall);
  const loadLevel = getLoadLevel(stats.inProgress);

  const metrics = [
    {
      icon: Clock,
      label: 'Estimated Queue Time',
      value: stats.queueMin,
      unit: 'min',
      level: queueLevel,
      barWidth: Math.min((stats.queueMin / 15) * 100, 100),
      description: 'AI-powered prediction using order history',
      priority: true,
    },
    {
      icon: Users,
      label: 'Store Traffic',
      value: stats.footfall,
      unit: 'people',
      level: trafficLevel,
      barWidth: Math.min((stats.footfall / 45) * 100, 100),
      description: 'Real-time occupancy from motion sensors',
      priority: false,
    },
    {
      icon: Activity,
      label: 'Orders In Progress',
      value: stats.inProgress,
      unit: '',
      level: loadLevel,
      barWidth: Math.min((stats.inProgress / 18) * 100, 100),
      description: 'Active orders being prepared',
      priority: false,
    },
    {
      icon: TrendingUp,
      label: 'Avg Prep Time',
      value: stats.avgPrep.toFixed(1),
      unit: 'min',
      level: { label: 'Current', color: 'bg-primary', emoji: '📊' },
      barWidth: Math.min((stats.avgPrep / 8) * 100, 100),
      description: 'Moving average from completed orders',
      priority: false,
    },
  ];

  return (
    <motion.div 
      className="bg-card rounded-2xl shadow-card p-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-2.5 bg-primary/10 rounded-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold">Smart Queue Prediction</h2>
            <p className="text-sm text-muted-foreground">AI-powered wait time estimation</p>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold"
        >
          LIVE
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300 hover:shadow-lg",
                metric.priority 
                  ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20" 
                  : "bg-secondary/50 border-border/50"
              )}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <metric.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                </div>
                <motion.span 
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1",
                    metric.level.color,
                    "text-primary-foreground"
                  )}
                  key={metric.level.label}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <span>{metric.level.emoji}</span>
                  <span>{metric.level.label}</span>
                </motion.span>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className={cn(
                  "font-extrabold tracking-tight",
                  metric.priority ? "text-4xl" : "text-3xl"
                )}>
                  <AnimatedNumber value={metric.value} />
                </span>
                {metric.unit && (
                  <span className="text-sm font-semibold text-muted-foreground">{metric.unit}</span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-3">{metric.description}</p>

              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", metric.level.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.barWidth}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QueuePrediction;
