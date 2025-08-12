"use client";

import { useState, useEffect } from "react";

interface FlashEventOverlayProps {
  activeEvent: any;
  onEventEnd: () => void;
}

export default function FlashEventOverlay({
  activeEvent,
  onEventEnd,
}: FlashEventOverlayProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (activeEvent && activeEvent.eventDetails) {
      setIsVisible(true);
      const endTime = new Date(activeEvent.endsAt).getTime();

      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          setIsVisible(false);
          setTimeout(onEventEnd, 500);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 100);

      return () => clearInterval(interval);
    }
  }, [activeEvent, onEventEnd]);

  if (!activeEvent || !activeEvent.eventDetails || !isVisible) return null;

  const { eventDetails } = activeEvent;
  const seconds = Math.ceil(timeRemaining / 1000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-xl shadow-2xl max-w-md mx-4 text-white text-center transform transition-all duration-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="text-6xl mb-4 animate-bounce">
          {eventDetails.name.split(" ")[0]}
        </div>

        <h2 className="text-2xl font-bold mb-2">{eventDetails.name}</h2>
        <p className="text-lg mb-4">{eventDetails.description}</p>

        <div className="bg-black bg-opacity-30 rounded-lg p-4 mb-4">
          <div className="text-3xl font-bold mb-2">{seconds}s</div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-100"
              style={{ width: `${(seconds / eventDetails.duration) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-sm space-y-1">
          <div className="font-semibold mb-2">Instructions:</div>
          <div className="opacity-90">{eventDetails.instructions}</div>
        </div>
      </div>
    </div>
  );
}
