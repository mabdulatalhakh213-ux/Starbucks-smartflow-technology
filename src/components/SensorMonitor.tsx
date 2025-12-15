import { SensorData } from '@/types/store';
import { Radio, Thermometer, Eye, Users, Wifi, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 animate-slide-up stagger-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Wifi className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Sensor Network</h2>
          <p className="text-sm text-muted-foreground">IoT monitoring for store operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sensors.map((sensor) => {
          const TypeIcon = getTypeIcon(sensor.type);
          const statusColor = getStatusColor(sensor.status);
          
          return (
            <div
              key={sensor.id}
              className="p-4 rounded-xl bg-secondary/30 border border-border/50 transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TypeIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">{sensor.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={cn("w-2 h-2 rounded-full", statusColor.replace('text-', 'bg-'))} />
                  {sensor.status === 'warning' && (
                    <AlertCircle className="w-3.5 h-3.5 text-warning" />
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-extrabold">{sensor.value}</span>
                <span className="text-sm text-muted-foreground">{sensor.unit}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{sensor.location}</span>
                <span className="uppercase tracking-wide">{sensor.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensorMonitor;
