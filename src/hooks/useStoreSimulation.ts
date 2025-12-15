import { useState, useEffect, useCallback, useRef } from 'react';
import { Order, StoreStats, TrafficMode, Cubby, SensorData, OrderStatus } from '@/types/store';
import { toast } from 'sonner';

const MENU_ITEMS = [
  "Iced Caramel Macchiato",
  "Caffè Latte",
  "Matcha Latte",
  "Cappuccino",
  "Caffè Americano",
  "Vanilla Latte",
  "Iced Latte",
  "Caramel Frappuccino",
  "Cold Brew",
  "Mocha",
  "Flat White",
  "Iced Shaken Espresso",
  "Pumpkin Spice Latte",
  "Green Tea Latte"
];

const CUSTOMER_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery",
  "Parker", "Skyler", "Jamie", "Drew", "Reese", "Cameron", "Dakota", "Sage",
  "Blake", "Charlie", "Finley", "Hayden", "Jesse", "Kai", "Lane", "Micah"
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const generateInitialCubbies = (): Cubby[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    status: 'empty' as const,
    temperature: (['hot', 'cold', 'ambient'] as const)[i % 3],
  }));
};

const generateInitialSensors = (): SensorData[] => [
  { id: 'S001', name: 'Entry Counter', type: 'motion', value: 24, unit: 'ppl/hr', status: 'active', location: 'Main Entrance' },
  { id: 'S002', name: 'Queue Density', type: 'proximity', value: 65, unit: '%', status: 'active', location: 'Order Counter' },
  { id: 'S003', name: 'Pickup Zone', type: 'occupancy', value: 4, unit: 'people', status: 'active', location: 'Pickup Area' },
  { id: 'S004', name: 'Cold Cubby Temp', type: 'temperature', value: 38, unit: '°F', status: 'active', location: 'Cubby Row A' },
  { id: 'S005', name: 'Hot Cubby Temp', type: 'temperature', value: 145, unit: '°F', status: 'active', location: 'Cubby Row B' },
  { id: 'S006', name: 'Drive-Thru', type: 'motion', value: 8, unit: 'cars', status: 'active', location: 'Drive-Thru Lane' },
];

export const useStoreSimulation = () => {
  const [mode, setMode] = useState<TrafficMode>('normal');
  const [orderCounter, setOrderCounter] = useState(104);
  const [orders, setOrders] = useState<Order[]>([
    { id: 102, item: "Iced Caramel Macchiato", status: "prep", created: nowTime(), customerName: "Alex" },
    { id: 103, item: "Caffè Latte", status: "almost", created: nowTime(), customerName: "Jordan" },
    { id: 104, item: "Matcha Latte", status: "ready", created: nowTime(), cubbyId: 3, customerName: "Taylor" },
  ]);
  const [stats, setStats] = useState<StoreStats>({
    queueMin: 6,
    footfall: 18,
    inProgress: 8,
    completed: 42,
    avgPrep: 4.8,
  });
  const [cubbies, setCubbies] = useState<Cubby[]>(generateInitialCubbies());
  const [sensors, setSensors] = useState<SensorData[]>(generateInitialSensors());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  
  const prevOrdersRef = useRef<Order[]>(orders);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Watch for order status changes and show toasts
  useEffect(() => {
    const prevOrders = prevOrdersRef.current;
    
    orders.forEach(order => {
      const prevOrder = prevOrders.find(o => o.id === order.id);
      
      if (prevOrder && prevOrder.status !== order.status) {
        if (order.status === 'ready') {
          toast.success(`Order #${order.id} is ready!`, {
            description: `${order.customerName}'s ${order.item} - Cubby #${order.cubbyId || 'N/A'}`,
            duration: 5000,
          });
        } else if (order.status === 'delayed') {
          toast.error(`Order #${order.id} delayed`, {
            description: `${order.customerName}'s order is taking longer than expected`,
            duration: 4000,
          });
        }
      }
    });
    
    prevOrdersRef.current = orders;
  }, [orders]);

  const addOrder = useCallback((customerName?: string) => {
    const newId = orderCounter + 1;
    setOrderCounter(newId);
    
    const name = customerName || CUSTOMER_NAMES[randInt(0, CUSTOMER_NAMES.length - 1)];
    const item = MENU_ITEMS[randInt(0, MENU_ITEMS.length - 1)];
    
    const newOrder: Order = {
      id: newId,
      item,
      status: 'prep',
      created: nowTime(),
      customerName: name,
    };
    
    setOrders(prev => [...prev, newOrder]);
    setStats(prev => ({
      ...prev,
      queueMin: clamp(prev.queueMin + randInt(0, 1), 1, 15),
      inProgress: prev.inProgress + 1,
    }));
    
    toast.info(`New order #${newId}`, {
      description: `${name} ordered ${item}`,
      duration: 3000,
    });
  }, [orderCounter]);

  const pickupOrder = useCallback((orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status !== 'ready') return;
    
    // Remove order and free cubby
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setCubbies(prev => prev.map(c => 
      c.orderId === orderId ? { ...c, status: 'empty', orderId: undefined, orderName: undefined } : c
    ));
    
    toast.success(`Order #${orderId} picked up!`, {
      description: `Thank you, ${order.customerName}!`,
      duration: 3000,
    });
  }, [orders]);

  const markCubbyPickedUp = useCallback((cubbyId: number) => {
    const cubby = cubbies.find(c => c.id === cubbyId);
    if (!cubby || cubby.status !== 'ready') return;
    
    if (cubby.orderId) {
      pickupOrder(cubby.orderId);
    }
  }, [cubbies, pickupOrder]);

  const simulateDelay = useCallback(() => {
    setOrders(prev => {
      const candidates = prev.filter(o => o.status !== 'ready' && o.status !== 'delayed');
      if (candidates.length === 0) return prev;
      
      const pickId = candidates[randInt(0, candidates.length - 1)].id;
      return prev.map(o => o.id === pickId ? { ...o, status: 'delayed' as OrderStatus } : o);
    });
    
    setStats(prev => ({
      ...prev,
      queueMin: clamp(prev.queueMin + randInt(1, 2), 1, 15),
    }));
  }, []);

  const speedUp = useCallback(() => {
    setOrders(prev => {
      const prep = prev.filter(o => o.status === 'prep');
      const almost = prev.filter(o => o.status === 'almost');
      
      if (prep.length) {
        const pickId = prep[randInt(0, prep.length - 1)].id;
        return prev.map(o => o.id === pickId ? { ...o, status: 'almost' as OrderStatus } : o);
      } else if (almost.length) {
        const order = almost[randInt(0, almost.length - 1)];
        const emptyCubby = cubbies.find(c => c.status === 'empty');
        
        if (emptyCubby) {
          setCubbies(c => c.map(cubby => 
            cubby.id === emptyCubby.id 
              ? { ...cubby, status: 'ready', orderId: order.id, orderName: order.customerName }
              : cubby
          ));
        }
        
        setStats(s => ({ ...s, completed: s.completed + 1 }));
        return prev.map(o => o.id === order.id ? { ...o, status: 'ready' as OrderStatus, cubbyId: emptyCubby?.id } : o);
      }
      return prev;
    });
    
    setStats(prev => ({
      ...prev,
      queueMin: clamp(prev.queueMin - 1, 1, 15),
    }));
  }, [cubbies]);

  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  // Main simulation tick
  useEffect(() => {
    if (!isLive) return;
    
    const tickMs = mode === 'rush' ? 1800 : mode === 'calm' ? 3000 : 2400;
    
    const tick = () => {
      // Update stats based on mode
      setStats(prev => {
        let newStats = { ...prev };
        
        if (mode === 'rush') {
          newStats.footfall = clamp(prev.footfall + randInt(1, 4), 25, 50);
          newStats.queueMin = clamp(prev.queueMin + randInt(0, 2), 7, 15);
          newStats.avgPrep = clamp(prev.avgPrep + (Math.random() * 0.4), 5.2, 7.5);
        } else if (mode === 'calm') {
          newStats.footfall = clamp(prev.footfall - randInt(1, 3), 5, 18);
          newStats.queueMin = clamp(prev.queueMin - randInt(0, 1), 1, 5);
          newStats.avgPrep = clamp(prev.avgPrep - (Math.random() * 0.3), 3.0, 5.0);
        } else {
          newStats.footfall = clamp(prev.footfall + randInt(-2, 2), 12, 30);
          newStats.queueMin = clamp(prev.queueMin + randInt(-1, 1), 3, 10);
          newStats.avgPrep = clamp(prev.avgPrep + (Math.random() * 0.2 - 0.1), 4.0, 6.2);
        }
        
        newStats.inProgress = orders.filter(o => o.status !== 'ready').length;
        
        return newStats;
      });

      // Progress orders
      setOrders(prev => {
        let updated = prev.map(o => {
          const roll = Math.random();
          
          if (o.status === 'prep' && roll > 0.60) {
            return { ...o, status: 'almost' as OrderStatus };
          }
          if (o.status === 'almost' && roll > 0.55) {
            const emptyCubby = cubbies.find(c => c.status === 'empty');
            if (emptyCubby) {
              setCubbies(c => c.map(cubby => 
                cubby.id === emptyCubby.id 
                  ? { ...cubby, status: 'ready', orderId: o.id, orderName: o.customerName }
                  : cubby
              ));
            }
            setStats(s => ({ ...s, completed: s.completed + 1 }));
            return { ...o, status: 'ready' as OrderStatus, cubbyId: emptyCubby?.id };
          }
          if (o.status === 'delayed' && roll > 0.75) {
            return { ...o, status: 'prep' as OrderStatus };
          }
          return o;
        });

        // Auto-add orders based on mode
        const addChance = mode === 'rush' ? 0.45 : mode === 'calm' ? 0.12 : 0.25;
        if (Math.random() < addChance && updated.length < 15) {
          const newId = orderCounter + 1;
          setOrderCounter(newId);
          const name = CUSTOMER_NAMES[randInt(0, CUSTOMER_NAMES.length - 1)];
          updated.push({
            id: newId,
            item: MENU_ITEMS[randInt(0, MENU_ITEMS.length - 1)],
            status: 'prep',
            created: nowTime(),
            customerName: name,
          });
        }

        // Auto-pickup old ready orders
        const ready = updated.filter(o => o.status === 'ready');
        if (updated.length > 10 && ready.length > 3 && Math.random() > 0.6) {
          const oldestReady = ready[0];
          if (oldestReady) {
            setCubbies(c => c.map(cubby => 
              cubby.orderId === oldestReady.id 
                ? { ...cubby, status: 'empty', orderId: undefined, orderName: undefined }
                : cubby
            ));
            updated = updated.filter(o => o.id !== oldestReady.id);
          }
        }

        return updated;
      });

      // Update sensor data with realistic fluctuations
      setSensors(prev => prev.map(sensor => {
        let newValue = sensor.value;
        
        if (sensor.type === 'motion') {
          const modifier = mode === 'rush' ? 1.4 : mode === 'calm' ? 0.6 : 1;
          newValue = clamp(sensor.value + randInt(-4, 6) * modifier, 5, 65);
        } else if (sensor.type === 'proximity') {
          newValue = clamp(sensor.value + randInt(-10, 10), 15, 98);
        } else if (sensor.type === 'occupancy') {
          newValue = clamp(sensor.value + randInt(-1, 2), 0, 15);
        } else if (sensor.type === 'temperature') {
          newValue = sensor.value + (Math.random() * 3 - 1.5);
        }
        
        return {
          ...sensor,
          value: Math.round(newValue * 10) / 10,
          status: sensor.type === 'temperature' && (newValue < 32 || newValue > 155) ? 'warning' : 'active',
        };
      }));
    };

    const interval = setInterval(tick, tickMs);
    return () => clearInterval(interval);
  }, [mode, orderCounter, cubbies, isLive, orders.length]);

  return {
    mode,
    setMode,
    orders,
    stats,
    cubbies,
    sensors,
    currentTime,
    isLive,
    addOrder,
    simulateDelay,
    speedUp,
    pickupOrder,
    markCubbyPickedUp,
    toggleLive,
  };
};
