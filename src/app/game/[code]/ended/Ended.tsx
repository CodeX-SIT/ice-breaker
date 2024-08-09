"use client";
import NavBar from "@/components/NavBar";
import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import React, { useEffect } from "react";
export default function Page({
  code,
  result,
}: {
  code: string;
  result: { name: string; completedAssignments: number; userId: string };
}) {
  const [interactive, setInteractive] = React.useState(false);
  useEffect(() => {
    setInteractive(true);
  }, []);

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
      <section className="flex h-screen w-screen justify-center items-center">
        <div className="text-center">
          <Typography variant="h1">Hi {result.name}.</Typography>
          <Typography variant="h1">
            You scored {result.completedAssignments}.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href={`/game/${code}/ended/mycollage`}
            onClick={() => setInteractive(false)}
          >
            View your collage
          </Button>
        </div>
      </section>
    </>
  );
}
