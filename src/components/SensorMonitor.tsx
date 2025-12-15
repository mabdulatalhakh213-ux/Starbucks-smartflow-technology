import { SensorData } from '@/types/store';
import { Radio, Thermometer, Eye, Users, Wifi, AlertCircle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SensorMonitorProps {
  sensors: SensorData[];
}

const SensorMonitor = ({ sensors }: SensorMonitorProps) => {
  const getTypeIcon = (type: SensorData['type']) => {
    switch (type) {
      case 'motion': return Radio;
      case 'temperature': return Thermometer;
      case 'proximity': return Eye;
      case 'occupancy': return Users;
    }
  };

  const getStatusColor = (status: SensorData['status']) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'warning': return 'text-warning';
      case 'offline': return 'text-destructive';
    }
  };

  const getTypeColor = (type: SensorData['type']) => {
    switch (type) {
      case 'motion': return 'from-info/10 to-info/5';
      case 'temperature': return 'from-destructive/10 to-destructive/5';
      case 'proximity': return 'from-warning/10 to-warning/5';
      case 'occupancy': return 'from-success/10 to-success/5';
    }
  };

  const activeSensors = sensors.filter(s => s.status === 'active').length;

  return (
    <motion.div 
      className="bg-card rounded-2xl shadow-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-2.5 bg-primary/10 rounded-xl"
            whileHover={{ scale: 1.1 }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wifi className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold">Sensor Network</h2>
            <p className="text-sm text-muted-foreground">IoT monitoring for store operations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
          <Activity className="w-3 h-3" />
          {activeSensors}/{sensors.length} Active
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sensors.map((sensor, index) => {
          const TypeIcon = getTypeIcon(sensor.type);
          const statusColor = getStatusColor(sensor.status);
          const typeColor = getTypeColor(sensor.type);
          
          return (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className={cn(
                "p-4 rounded-xl border border-border/50 transition-all duration-300 hover:border-primary/30",
                `bg-gradient-to-br ${typeColor}`
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TypeIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">{sensor.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <motion.div 
                    className={cn("w-2 h-2 rounded-full", statusColor.replace('text-', 'bg-'))}
                    animate={sensor.status === 'active' ? { scale: [1, 1.2, 1] } : undefined}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  {sensor.status === 'warning' && (
                    <AlertCircle className="w-3.5 h-3.5 text-warning" />
                  )}
                </div>
              </div>

              <motion.div 
                className="flex items-baseline gap-1 mb-1"
                key={sensor.value}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-2xl font-extrabold tabular-nums">{sensor.value}</span>
                <span className="text-sm text-muted-foreground">{sensor.unit}</span>
              </motion.div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{sensor.location}</span>
                <span className="uppercase tracking-wide font-mono">{sensor.id}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SensorMonitor;
