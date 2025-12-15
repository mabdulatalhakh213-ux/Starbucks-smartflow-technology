export type OrderStatus = 'prep' | 'almost' | 'ready' | 'delayed';
export type TrafficMode = 'normal' | 'rush' | 'calm';
export type CubbyStatus = 'empty' | 'ready' | 'waiting';

export interface Order {
  id: number;
  item: string;
  status: OrderStatus;
  created: string;
  cubbyId?: number;
}

export interface StoreStats {
  queueMin: number;
  footfall: number;
  inProgress: number;
  completed: number;
  avgPrep: number;
}

export interface Cubby {
  id: number;
  status: CubbyStatus;
  orderId?: number;
  orderName?: string;
  temperature: 'hot' | 'cold' | 'ambient';
}

export interface SensorData {
  id: string;
  name: string;
  type: 'motion' | 'temperature' | 'proximity' | 'occupancy';
  value: number;
  unit: string;
  status: 'active' | 'warning' | 'offline';
  location: string;
}
