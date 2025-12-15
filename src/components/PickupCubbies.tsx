import { Cubby } from '@/types/store';
import { Package, Snowflake, Flame, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PickupCubbiesProps {
  cubbies: Cubby[];
}

const PickupCubbies = ({ cubbies }: PickupCubbiesProps) => {
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

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 animate-slide-up stagger-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Package className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Smart Pickup Cubbies</h2>
          <p className="text-sm text-muted-foreground">Temperature-controlled order storage</p>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {cubbies.map((cubby) => {
          const TempIcon = getTempIcon(cubby.temperature);
          const tempColor = getTempColor(cubby.temperature);
          
          return (
            <div
              key={cubby.id}
              className={cn(
                "relative aspect-square rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 p-2",
                cubby.status === 'ready' && "border-success bg-success/10 animate-cubby-pulse",
                cubby.status === 'waiting' && "border-warning bg-warning/10",
                cubby.status === 'empty' && "border-border bg-secondary/30"
              )}
            >
              <span className="text-xs font-bold text-muted-foreground">#{cubby.id}</span>
              
              <TempIcon className={cn("w-4 h-4", tempColor)} />
              
              {cubby.status === 'ready' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-success-foreground font-bold">✓</span>
                </div>
              )}
              
              {cubby.orderId && (
                <span className="text-[10px] font-semibold text-foreground">
                  #{cubby.orderId}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
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
          <div className="w-3 h-3 rounded-full bg-success" />
          <span>Ready for Pickup</span>
        </div>
      </div>
    </div>
  );
};

export default PickupCubbies;
