import { Order, OrderStatus } from '@/types/store';
import { Coffee, Clock, CheckCircle2, AlertTriangle, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderBoardProps {
  orders: Order[];
  onOrderClick: (orderId: number) => void;
}

const OrderBoard = ({ orders, onOrderClick }: OrderBoardProps) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'prep':
        return {
          icon: Clock,
          label: 'Preparing',
          className: 'bg-warning/10 text-warning border-warning/30',
          dotClass: 'bg-warning',
          animation: 'animate-pulse',
        };
      case 'almost':
        return {
          icon: Coffee,
          label: 'Almost Ready',
          className: 'bg-info/10 text-info border-info/30',
          dotClass: 'bg-info',
          animation: '',
        };
      case 'ready':
        return {
          icon: CheckCircle2,
          label: 'Ready!',
          className: 'bg-success/10 text-success border-success/30',
          dotClass: 'bg-success',
          animation: 'animate-pulse-glow',
        };
      case 'delayed':
        return {
          icon: AlertTriangle,
          label: 'Delayed',
          className: 'bg-destructive/10 text-destructive border-destructive/30',
          dotClass: 'bg-destructive',
          animation: 'animate-pulse',
        };
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const priority = { ready: 0, almost: 1, prep: 2, delayed: 3 };
    return priority[a.status] - priority[b.status] || b.id - a.id;
  });

  const ordersByStatus = {
    ready: orders.filter(o => o.status === 'ready').length,
    almost: orders.filter(o => o.status === 'almost').length,
    prep: orders.filter(o => o.status === 'prep').length,
    delayed: orders.filter(o => o.status === 'delayed').length,
  };

  return (
    <motion.div 
      className="bg-card rounded-2xl shadow-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-2.5 bg-primary/10 rounded-xl"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <Coffee className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold">Digital Order Board</h2>
            <p className="text-sm text-muted-foreground">Live order status display</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Auto-updates
        </span>
      </div>

      {/* Status Summary */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
          {ordersByStatus.ready} Ready
        </span>
        <span className="px-3 py-1 rounded-full bg-info/10 text-info text-xs font-bold">
          {ordersByStatus.almost} Almost
        </span>
        <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-bold">
          {ordersByStatus.prep} Preparing
        </span>
        {ordersByStatus.delayed > 0 && (
          <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold">
            {ordersByStatus.delayed} Delayed
          </span>
        )}
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {sortedOrders.map((order) => {
            const config = getStatusConfig(order.status);
            const StatusIcon = config.icon;
            const isReady = order.status === 'ready';
            
            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => isReady && onOrderClick(order.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                  "bg-secondary/30 hover:bg-secondary/50",
                  isReady && "ring-2 ring-success/30 cursor-pointer hover:ring-success/50",
                  config.animation
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-extrabold">#{order.id}</span>
                    {order.customerName && (
                      <span className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                        <User className="w-3 h-3" />
                        {order.customerName}
                      </span>
                    )}
                    {order.cubbyId && (
                      <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-semibold">
                        <MapPin className="w-3 h-3" />
                        Cubby #{order.cubbyId}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {order.item} • {order.created}
                  </p>
                </div>

                <motion.div 
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold whitespace-nowrap ml-2",
                    config.className
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={cn("w-2 h-2 rounded-full", config.dotClass)} />
                  <StatusIcon className="w-4 h-4" />
                  <span>{config.label}</span>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {orders.length === 0 && (
        <motion.div 
          className="text-center py-12 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No orders in queue</p>
          <p className="text-xs mt-1">New orders will appear here automatically</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderBoard;
