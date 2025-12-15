import { useState, useEffect, useCallback } from 'react';
import { Order, StoreStats, TrafficMode, Cubby, SensorData, OrderStatus } from '@/types/store';

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

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
    { id: 102, item: "Iced Caramel Macchiato", status: "prep", created: nowTime() },
    { id: 103, item: "Caffè Latte", status: "almost", created: nowTime() },
    { id: 104, item: "Matcha Latte", status: "ready", created: nowTime(), cubbyId: 3 },
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

  const addOrder = useCallback(() => {
    const newId = orderCounter + 1;
    setOrderCounter(newId);
    
    const newOrder: Order = {
      id: newId,
      item: MENU_ITEMS[randInt(0, MENU_ITEMS.length - 1)],
      status: 'prep',
      created: nowTime(),
    };
    
    setOrders(prev => [...prev, newOrder]);
    setStats(prev => ({
      ...prev,
      queueMin: clamp(prev.queueMin + randInt(0, 1), 1, 15),
      inProgress: prev.inProgress + 1,
    }));
  }, [orderCounter]);

  const simulateDelay = useCallback(() => {
    setOrders(prev => {
      const candidates = prev.filter(o => o.status !== 'ready');
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
        const pickId = almost[randInt(0, almost.length - 1)].id;
        const emptyCubby = cubbies.find(c => c.status === 'empty');
        
        if (emptyCubby) {
          setCubbies(c => c.map(cubby => 
            cubby.id === emptyCubby.id 
              ? { ...cubby, status: 'ready', orderId: pickId }
              : cubby
          ));
        }
        
        setStats(s => ({ ...s, completed: s.completed + 1 }));
        return prev.map(o => o.id === pickId ? { ...o, status: 'ready' as OrderStatus, cubbyId: emptyCubby?.id } : o);
      }
      return prev;
    });
    
    setStats(prev => ({
      ...prev,
      queueMin: clamp(prev.queueMin - 1, 1, 15),
    }));
  }, [cubbies]);

  // Main simulation tick
  useEffect(() => {
    const tickMs = mode === 'rush' ? 2000 : mode === 'calm' ? 2800 : 2400;
    
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
        
        return newStats;
      });

      // Progress orders
      setOrders(prev => {
        let updated = prev.map(o => {
          const roll = Math.random();
          
          if (o.status === 'prep' && roll > 0.65) {
            return { ...o, status: 'almost' as OrderStatus };
          }
          if (o.status === 'almost' && roll > 0.60) {
            const emptyCubby = cubbies.find(c => c.status === 'empty');
            setStats(s => ({ ...s, completed: s.completed + 1 }));
            return { ...o, status: 'ready' as OrderStatus, cubbyId: emptyCubby?.id };
          }
          if (o.status === 'delayed' && roll > 0.70) {
            return { ...o, status: 'prep' as OrderStatus };
          }
          return o;
        });

        // Auto-add orders based on mode
        const addChance = mode === 'rush' ? 0.5 : mode === 'calm' ? 0.15 : 0.3;
        if (Math.random() < addChance && updated.length < 15) {
          const newId = orderCounter + 1;
          setOrderCounter(newId);
          updated.push({
            id: newId,
            item: MENU_ITEMS[randInt(0, MENU_ITEMS.length - 1)],
            status: 'prep',
            created: nowTime(),
          });
        }

        // Remove old ready orders to prevent infinite growth
        const ready = updated.filter(o => o.status === 'ready');
        if (updated.length > 12 && ready.length > 4) {
          const oldestReadyIndex = updated.findIndex(o => o.status === 'ready');
          if (oldestReadyIndex !== -1) {
            const removedOrder = updated[oldestReadyIndex];
            updated.splice(oldestReadyIndex, 1);
            setCubbies(c => c.map(cubby => 
              cubby.orderId === removedOrder.id 
                ? { ...cubby, status: 'empty', orderId: undefined }
                : cubby
            ));
          }
        }

        return updated;
      });

      // Update cubbies based on ready orders
      setCubbies(prev => {
        return prev.map(cubby => {
          if (cubby.status === 'ready' && Math.random() > 0.85) {
            return { ...cubby, status: 'empty', orderId: undefined };
          }
          return cubby;
        });
      });

      // Update sensor data with realistic fluctuations
      setSensors(prev => prev.map(sensor => {
        let newValue = sensor.value;
        
        if (sensor.type === 'motion') {
          const modifier = mode === 'rush' ? 1.3 : mode === 'calm' ? 0.7 : 1;
          newValue = clamp(sensor.value + randInt(-3, 5) * modifier, 5, 60);
        } else if (sensor.type === 'proximity') {
          newValue = clamp(sensor.value + randInt(-8, 8), 20, 95);
        } else if (sensor.type === 'occupancy') {
          newValue = clamp(sensor.value + randInt(-1, 2), 0, 12);
        } else if (sensor.type === 'temperature') {
          newValue = sensor.value + (Math.random() * 2 - 1);
        }
        
        return {
          ...sensor,
          value: Math.round(newValue * 10) / 10,
          status: sensor.type === 'temperature' && (newValue < 35 || newValue > 150) ? 'warning' : 'active',
        };
      }));
    };

    const interval = setInterval(tick, tickMs);
    return () => clearInterval(interval);
  }, [mode, orderCounter, cubbies]);

  return {
    mode,
    setMode,
    orders,
    stats,
    cubbies,
    sensors,
    addOrder,
    simulateDelay,
    speedUp,
  };
};
