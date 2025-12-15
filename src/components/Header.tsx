import StarbucksLogo from './StarbucksLogo';
import { TrafficMode } from '@/types/store';
import { cn } from '@/lib/utils';

interface HeaderProps {
  mode: TrafficMode;
  onModeChange: (mode: TrafficMode) => void;
}

const Header = ({ mode, onModeChange }: HeaderProps) => {
  const modes: { value: TrafficMode; label: string }[] = [
    { value: 'calm', label: 'Calm' },
    { value: 'normal', label: 'Normal' },
    { value: 'rush', label: 'Rush Hour' },
  ];

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <StarbucksLogo className="w-14 h-14 animate-float" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Smart Store Technology
              </h1>
              <p className="text-sm opacity-90">
                Queue Prediction • Pickup Cubbies • Digital Ordering • Sensors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-primary-foreground/10 p-1.5 rounded-full backdrop-blur-sm">
            {modes.map((m) => (
              <button
                key={m.value}
                onClick={() => onModeChange(m.value)}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300",
                  mode === m.value
                    ? "bg-primary-foreground text-primary shadow-md"
                    : "text-primary-foreground/90 hover:bg-primary-foreground/20"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
