"use client";

import { useState, useEffect } from "react";

interface FlashEventEndOverlayProps {
  lastEvent: any;
  onDismiss: () => void;
}

export default function FlashEventEndOverlay({
  lastEvent,
  onDismiss,
}: FlashEventEndOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lastEvent) {
      setIsVisible(true);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [lastEvent, onDismiss]);

  if (!lastEvent || !lastEvent.eventDetails) return null;

  const { eventDetails } = lastEvent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div
        className={`bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-2xl max-w-md mx-4 text-white text-center transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="text-6xl mb-4">✅</div>

        <h2 className="text-2xl font-bold mb-2">Flash Event Complete!</h2>
        <p className="text-lg mb-4">
          <span className="font-semibold">{eventDetails.name}</span> has ended
        </p>

        <div className="bg-black bg-opacity-20 rounded-lg p-4">
          <div className="text-sm opacity-90">
            Great job participating! Resume normal gameplay.
          </div>
        </div>
      </div>
    </div>
  );
}
