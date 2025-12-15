import { useStoreSimulation } from '@/hooks/useStoreSimulation';
import Header from '@/components/Header';
import QueuePrediction from '@/components/QueuePrediction';
import PickupCubbies from '@/components/PickupCubbies';
import OrderBoard from '@/components/OrderBoard';
import SensorMonitor from '@/components/SensorMonitor';
import DemoControls from '@/components/DemoControls';
import { Toaster } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

const Index = () => {
  const {
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
  } = useStoreSimulation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Toaster position="top-right" richColors closeButton />
      
      <Header 
        mode={mode} 
        onModeChange={setMode} 
        currentTime={currentTime}
        isLive={isLive}
        onToggleLive={toggleLive}
      />
      
      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main displays */}
          <div className="lg:col-span-2 space-y-6">
            <QueuePrediction stats={stats} />
            <PickupCubbies cubbies={cubbies} onCubbyClick={markCubbyPickedUp} />
            <OrderBoard orders={orders} onOrderClick={pickupOrder} />
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
        <motion.footer 
          className="mt-12 text-center pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card shadow-card border border-border/50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
              <span className="text-sm font-semibold">Smart Store Technology</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">Hackathon Prototype</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground max-w-md mx-auto">
            Queue Prediction • Pickup Cubbies • Digital Ordering • IoT Sensors
          </p>
        </motion.footer>
      </main>
    </div>
  );
};

export default Index;
