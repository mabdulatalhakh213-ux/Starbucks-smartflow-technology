import { Order, OrderStatus } from '@/types/store';
import { Coffee, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderBoardProps {
  orders: Order[];
}

const OrderBoard = ({ orders }: OrderBoardProps) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'prep':
        return {
          icon: Clock,
          label: 'Preparing',
          className: 'bg-warning/10 text-warning border-warning/30',
          dotClass: 'bg-warning',
        };
      case 'almost':
        return {
          icon: Coffee,
          label: 'Almost Ready',
          className: 'bg-info/10 text-info border-info/30',
          dotClass: 'bg-info',
        };
      case 'ready':
        return {
          icon: CheckCircle2,
          label: 'Ready',
          className: 'bg-success/10 text-success border-success/30 animate-pulse-glow',
          dotClass: 'bg-success',
        };
      case 'delayed':
        return {
          icon: AlertTriangle,
          label: 'Delayed',
          className: 'bg-destructive/10 text-destructive border-destructive/30',
          dotClass: 'bg-destructive',
        };
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const priority = { ready: 0, almost: 1, prep: 2, delayed: 3 };
    return priority[a.status] - priority[b.status] || b.id - a.id;
  });

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 animate-slide-up stagger-3">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Coffee className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Digital Order Board</h2>
            <p className="text-sm text-muted-foreground">Live order status display</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          Auto-updates
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {sortedOrders.map((order, index) => {
          const config = getStatusConfig(order.status);
          const StatusIcon = config.icon;
          
          return (
            <div
              key={order.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                "bg-secondary/30 hover:bg-secondary/50",
                order.status === 'ready' && "ring-2 ring-success/30"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold">#{order.id}</span>
                  {order.cubbyId && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                      Cubby #{order.cubbyId}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {order.item} • {order.created}
                </p>
              </div>

              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold whitespace-nowrap",
                config.className
              )}>
                <div className={cn("w-2 h-2 rounded-full", config.dotClass)} />
                <StatusIcon className="w-4 h-4" />
                <span>{config.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No orders in queue</p>
        </div>
      )}
    </div>
  );
};

export default OrderBoard;
