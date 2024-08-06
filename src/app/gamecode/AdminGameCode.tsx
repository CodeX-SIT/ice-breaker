"use client";

import NavBar from "@/components/NavBar";
import { GameCode } from "@/database";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";

function AdminGameCode() {
  const [gameCode, setGameCode] = React.useState<GameCode | null>(null);
  const [createGameCode, setCreateGameCode] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  useEffect(() => {
    const fetchGameCode = async () => {
      const response = await fetch("/api/gamecode/create", {
        body: JSON.stringify({ createGameCode }),
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setGameCode(data);
      }
    };

    fetchGameCode();
  }, [createGameCode, date]);

  return (
    <main>
      <NavBar />
      <section className="flex h-screen w-screen justify-center items-center">
        <Box
          sx={{
            marginTop: 8,
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h3" sx={{ marginTop: 2 }}>
              Game Code
            </Typography>
            {gameCode && (
              <Typography variant="h1" sx={{ m: 2 }}>
                Your game code is:{" "}
                <strong className="uppercase">{gameCode.code}</strong>
              </Typography>
            )}
            {!gameCode && (
              <Typography variant="h1" sx={{ m: 2 }}>
                No game code available
              </Typography>
            )}
            <Button
              sx={{ mb: 2 }}
              variant="contained"
              onClick={() => {
                setCreateGameCode(true);
                setDate(new Date());
              }}
            >
              Create Game Code
            </Button>
          </Paper>
          <Paper
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              minWidth: "50%",
              p: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" color="success">
                  Start Game
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" color="error">
                  End Game
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </section>
    </main>
  );
}

export default AdminGameCode;
