import { useStoreSimulation } from '@/hooks/useStoreSimulation';
import Header from '@/components/Header';
import QueuePrediction from '@/components/QueuePrediction';
import PickupCubbies from '@/components/PickupCubbies';
import OrderBoard from '@/components/OrderBoard';
import SensorMonitor from '@/components/SensorMonitor';
import DemoControls from '@/components/DemoControls';

const Index = () => {
  const {
    mode,
    setMode,
    orders,
    stats,
    cubbies,
    sensors,
    addOrder,
    simulateDelay,
    speedUp,
  } = useStoreSimulation();

  return (
    <div className="min-h-screen bg-background">
      <Header mode={mode} onModeChange={setMode} />
      
      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main displays */}
          <div className="lg:col-span-2 space-y-6">
            <QueuePrediction stats={stats} />
            <PickupCubbies cubbies={cubbies} />
            <OrderBoard orders={orders} />
          </div>

          {/* Right column - Sensors and Controls */}
          <div className="space-y-6">
            <SensorMonitor sensors={sensors} />
            <DemoControls
              stats={stats}
              onAddOrder={addOrder}
              onSpeedUp={speedUp}
              onSimulateDelay={simulateDelay}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground pb-8">
          <p className="font-medium">Smart Store Technology • Hackathon Prototype</p>
          <p className="mt-1 opacity-75">
            Queue Prediction • Pickup Cubbies • Digital Ordering • IoT Sensors
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
