import StarbucksLogo from './StarbucksLogo';
import { TrafficMode } from '@/types/store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Play, Pause, Clock } from 'lucide-react';

interface HeaderProps {
  mode: TrafficMode;
  onModeChange: (mode: TrafficMode) => void;
  currentTime: Date;
  isLive: boolean;
  onToggleLive: () => void;
}

const Header = ({ mode, onModeChange, currentTime, isLive, onToggleLive }: HeaderProps) => {
  const modes: { value: TrafficMode; label: string; emoji: string }[] = [
    { value: 'calm', label: 'Calm', emoji: '🌙' },
    { value: 'normal', label: 'Normal', emoji: '☀️' },
    { value: 'rush', label: 'Rush Hour', emoji: '🔥' },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <div className="container py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <StarbucksLogo className="w-14 h-14" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-xl font-bold tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Smart Store Technology
              </motion.h1>
              <motion.p 
                className="text-sm opacity-90"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Queue Prediction • Pickup Cubbies • Digital Ordering • Sensors
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Live Clock */}
            <motion.div 
              className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Clock className="w-4 h-4" />
              <div className="text-right">
                <div className="text-sm font-bold tabular-nums">{formatTime(currentTime)}</div>
                <div className="text-xs opacity-75">{formatDate(currentTime)}</div>
              </div>
            </motion.div>

            {/* Live Toggle */}
            <motion.button
              onClick={onToggleLive}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                isLive 
                  ? "bg-success text-success-foreground" 
                  : "bg-primary-foreground/20 text-primary-foreground"
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLive ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isLive ? 'LIVE' : 'PAUSED'}
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
                </span>
              )}
            </motion.button>

            {/* Mode Selector */}
            <motion.div 
              className="flex items-center gap-1 bg-primary-foreground/10 p-1.5 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {modes.map((m) => (
                <motion.button
                  key={m.value}
                  onClick={() => onModeChange(m.value)}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-2",
                    mode === m.value
                      ? "bg-primary-foreground text-primary shadow-md"
                      : "text-primary-foreground/90 hover:bg-primary-foreground/20"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{m.emoji}</span>
                  <span className="hidden sm:inline">{m.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
