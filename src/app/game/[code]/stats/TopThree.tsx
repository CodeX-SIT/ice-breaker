"use client";
import React, { useEffect, useState } from "react";
import "./RevealResultPage.css";
import axios from "axios";
import NavBar from "../../../../components/NavBar";
import CustomConfetti from "@/components/CustomConfetti";

const TopThree = ({ code }: { code: string }) => {
  const [reveal, setReveal] = useState<number[]>([]);
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
    if (reveal.length === 0) setReveal([2]);
    else if (reveal.length === 1) setReveal([1, 2]);
    else if (reveal.length === 2) {
      setReveal([0, 1, 2]);
      setConfetti(true);
    } else if (reveal.length === 3) {
      setReveal([0, 1, 2, 3]);
    } else {
      setReveal([0, 1, 2, 3, 4]);
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
  const topResults = sortedArray.slice(0, 3);
  const otherResults = sortedArray.slice(3);
  return (
    <>
      <NavBar />
      <div className="result-container" onClick={handleRevealNext}>
        <div className="confetti-container">
          <CustomConfetti run={confetti} />
        </div>
        {topResults.map((result, index) => (
          <div
            key={result.name}
            className={`result-number ${
              reveal.includes(index) ? "revealed" : ""
            }`}
          >
            {`${result.name}: ${result.completedAssignments}`}
          </div>
        ))}
        {reveal.includes(4) &&
          otherResults.map((result) => (
            <div key={result.name} className={`result-number "revealed"`}>
              {`${result.name}: ${result.completedAssignments}`}
            </div>
          ))}
      </div>
    </>
  );
};

export default TopThree;
