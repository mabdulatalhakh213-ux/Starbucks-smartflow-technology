import { StoreStats } from '@/types/store';
import { Clock, Users, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QueuePredictionProps {
  stats: StoreStats;
}

const QueuePrediction = ({ stats }: QueuePredictionProps) => {
  const getQueueLevel = (min: number) => {
    if (min <= 4) return { label: 'Low', color: 'bg-success', textColor: 'text-success' };
    if (min <= 8) return { label: 'Medium', color: 'bg-warning', textColor: 'text-warning' };
    return { label: 'High', color: 'bg-destructive', textColor: 'text-destructive' };
  };

  const getTrafficLevel = (footfall: number) => {
    if (footfall <= 15) return { label: 'Low', color: 'bg-success' };
    if (footfall <= 30) return { label: 'Moderate', color: 'bg-info' };
    return { label: 'Busy', color: 'bg-warning' };
  };

  const getLoadLevel = (inProgress: number) => {
    if (inProgress <= 6) return { label: 'Light', color: 'bg-success' };
    if (inProgress <= 12) return { label: 'Medium', color: 'bg-warning' };
    return { label: 'Heavy', color: 'bg-destructive' };
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
    },
    {
      icon: Users,
      label: 'Store Traffic',
      value: stats.footfall,
      unit: 'people',
      level: trafficLevel,
      barWidth: Math.min((stats.footfall / 45) * 100, 100),
      description: 'Real-time occupancy from motion sensors',
    },
    {
      icon: Activity,
      label: 'Orders In Progress',
      value: stats.inProgress,
      unit: '',
      level: loadLevel,
      barWidth: Math.min((stats.inProgress / 18) * 100, 100),
      description: 'Active orders being prepared',
    },
    {
      icon: TrendingUp,
      label: 'Avg Prep Time',
      value: stats.avgPrep.toFixed(1),
      unit: 'min',
      level: { label: 'Current', color: 'bg-primary' },
      barWidth: Math.min((stats.avgPrep / 8) * 100, 100),
      description: 'Moving average from completed orders',
    },
  ];

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Clock className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Smart Queue Prediction</h2>
          <p className="text-sm text-muted-foreground">AI-powered wait time estimation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              "p-4 rounded-xl bg-secondary/50 border border-border/50 transition-all duration-300 hover:shadow-md",
              `stagger-${index + 1}`
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-bold",
                metric.level.color,
                "text-primary-foreground"
              )}>
                {metric.level.label}
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-extrabold tracking-tight">{metric.value}</span>
              {metric.unit && (
                <span className="text-sm font-semibold text-muted-foreground">{metric.unit}</span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-3">{metric.description}</p>

            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700 ease-out", metric.level.color)}
                style={{ width: `${metric.barWidth}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueuePrediction;
