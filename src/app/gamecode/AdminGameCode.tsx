"use client";

import NavBar from "@/components/NavBar";
import { GameCode } from "@/database";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { InferAttributes } from "sequelize";

function AdminGameCode() {
  const [gameCode, setGameCode] = React.useState<GameCode | null>();
  const [createGameCode, setCreateGameCode] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  const gameCodeActions = async (action: "start" | "end") => {
    fetch("/api/gamecode/actions", {
      method: "POST",
      body: JSON.stringify({ action, gameCode: gameCode?.code }),
    });
  };

  useEffect(() => {
    const fetchGameCode = async () => {
      const response = await fetch("/api/gamecode/create", {
        body: JSON.stringify({ createGameCode }),
        method: "POST",
      });
      const json = await response.json();
      if (response.ok) {
        setGameCode(json);
      } else if (response.status === 404) {
        setGameCode(null);
      } else if (response.status === 409) {
        console.log(json, response.ok);
        setGameCode(json);
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
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => {
                    gameCodeActions("start");
                  }}
                >
                  Start Game
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => {
                    gameCodeActions("end");
                  }}
                >
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
