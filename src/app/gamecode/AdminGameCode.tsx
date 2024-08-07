"use client";

import NavBar from "@/components/NavBar";
import { GameCode } from "@/database";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function AdminGameCode() {
  const [gameCode, setGameCode] = React.useState<GameCode | null>();
  const [createGameCode, setCreateGameCode] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [users, setUsers] = React.useState<any>();
  const router = useRouter();

  const gameCodeActions = async (action: "start" | "end") => {
    axios
      .post("/api/gamecode/actions", {
        action,
        gameCode: gameCode?.code,
      })
      .catch(console.error);
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameCode) return;
      if (gameCode.startedAt && users) return;
      const code = gameCode.code;
      axios
        .get(`/api/gamecode/${code}/users`)
        .then(({ data }) => {
          const users = data.users;
          setUsers(users);
        })
        .catch((error) => console.error(error));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameCode, users]);

  const userNames = users?.map((user: any) => user.aboutUser.name) as
    | any[]
    | undefined;

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
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => router.push(`/game/${gameCode?.code}/stats`)}
              >
                View Stats
              </Button>
            </Grid>
          </Paper>
          <Paper
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "50%",
              p: 2,
            }}
          >
            {userNames?.map((user, index) => (
              <Typography key={index} variant="h5">
                {user}
              </Typography>
            ))}
          </Paper>
        </Box>
      </section>
    </main>
  );
}

export default AdminGameCode;
