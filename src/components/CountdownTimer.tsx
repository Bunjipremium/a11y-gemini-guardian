
import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-06-28T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-sm border-b border-orange-300/30 py-4 relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 text-white">
          {/* Warning Icon and Text */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="text-center lg:text-left">
              <div className="font-bold text-lg">WCAG 2.2 Deadline</div>
              <div className="text-sm opacity-90">Barrierefreiheit wird Pflicht</div>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-white/80" />
            <div className="flex items-center gap-3 font-mono">
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 min-w-[50px]">
                  {timeLeft.days.toString().padStart(2, '0')}
                </div>
                <div className="text-xs mt-1 opacity-80">Tage</div>
              </div>
              <div className="text-xl opacity-60">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 min-w-[50px]">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs mt-1 opacity-80">Std</div>
              </div>
              <div className="text-xl opacity-60">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 min-w-[50px]">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs mt-1 opacity-80">Min</div>
              </div>
              <div className="text-xl opacity-60">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 min-w-[50px]">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs mt-1 opacity-80">Sek</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center lg:text-right">
            <div className="font-semibold">Jetzt handeln!</div>
            <div className="text-sm opacity-90">Vermeiden Sie Bußgelder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
