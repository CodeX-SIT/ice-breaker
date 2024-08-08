import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function CustomConfetti({ run }: { run: boolean }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // this is done as a workaround for the window object not being available during build time
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  return (
    <Confetti
      width={dimensions.width}
      height={dimensions.height}
      run={run}
      numberOfPieces={500}
      recycle={false}
      gravity={0.3}
      initialVelocityY={20}
    />
  );
}
