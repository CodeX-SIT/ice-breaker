"use client";
import React, { useEffect, useState } from "react";
import "./RevealResultPage.css";
import axios from "axios";
import NavBar from "../../../../components/NavBar";
import CustomConfetti from "@/components/CustomConfetti";
import { Button, CircularProgress } from "@mui/material";

const TopThree = ({ code }: { code: string }) => {
  const [reveal, setReveal] = useState<number[]>([]);
  const [confetti, setConfetti] = useState(false);
  const [stats, setStats] = React.useState<any[]>([]);
  const [interactive, setInteractive] = React.useState(false);

  useEffect(() => {
    setInteractive(true);
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
  const otherResults = sortedArray.slice(3, 10);

  if (!interactive) {
    return (
      <>
        <section className="flex h-screen w-screen justify-center items-center">
          <CircularProgress />
        </section>
      </>
    );
  }
  return (
    <>
      <NavBar />
      <div className="confetti-container">
        <CustomConfetti run={confetti} />
      </div>
      <div className="result-container" onClick={handleRevealNext}>
        <div className="top-results-container">
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
        </div>
        {reveal.includes(0) && (
          <Button
            variant="contained"
            color="primary"
            href={`/game/${code}/gallery`}
            className="reveal"
            onClick={() => setInteractive(false)}
          >
            View Photobooth
          </Button>
        )}
        {reveal.includes(4) && (
          <div className="other-results-container">
            {otherResults.map((result) => (
              <div key={result.name} className="result-number revealed">
                {`${result.name}: ${result.completedAssignments}`}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TopThree;
