"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./RevealResultPage.css";
import axios from "axios";
import NavBar from "../../../../components/NavBar";

const TopThree = ({ code }: { code: string }) => {
  const [reveal, setReveal] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [stats, setStats] = React.useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`/api/gamecode/${code}/stats`)
      .then(({ data }) => {
        setStats(data);
      })
      .catch((error) => console.error(error));
  }, [code]);

  const handleRevealNext = () => {
    if (reveal < 3) {
      setReveal(reveal + 1);
      if (reveal + 1 === 3) {
        setConfetti(true); // Trigger confetti
      }
    }
  };

  const array = [
    { name: "John", completedAssignments: 97 },
    { name: "Jane", completedAssignments: 80 },
    { name: "Doe", completedAssignments: 90 },
  ];

  const sortedArray = stats.map((user, index) => {
    return {
      ...user,
      name: `${index + 1}. ${user.name}`,
    };
  });

  // Getting the top 3 results
  const topResults = sortedArray.slice(0, 3).reverse();
  return (
    <>
      <NavBar />
      <div className="result-container" onClick={handleRevealNext}>
        <div className="confetti-container">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            run={confetti}
            numberOfPieces={500}
            recycle={false}
            gravity={0.3}
            initialVelocityY={20}
          />
        </div>
        {topResults.map((result, index) => (
          <div
            key={result.name}
            className={`result-number ${reveal > index ? "revealed" : ""}`}
          >
            {`${result.name}: ${result.completedAssignments}`}
          </div>
        ))}
      </div>
    </>
  );
};

export default TopThree;
