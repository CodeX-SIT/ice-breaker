"use client";

import NavBar from "@/components/NavBar";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";
import { GameCode } from "@/database";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  formControlLabelClasses,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function AdminGameCode() {
  const [gameCode, setGameCode] = React.useState<GameCode | null>();
  const [createGameCode, setCreateGameCode] = React.useState(false);
  const [fetchedGameCode, setFetchedGameCode] = React.useState(false);
  const [firstFetch, setFirstFetch] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [response, setResponse] = React.useState({ status: 0, message: "" });
  const [gameState, setGameState] = React.useState<
    "started" | "ended" | "waiting"
  >("waiting");
  const [date, setDate] = React.useState(new Date());
  const [users, setUsers] = React.useState<any>();
  const router = useRouter();

  const gameCodeActions = async (action: "start" | "end") => {
    setFetchedGameCode(false);
    axios
      .post("/api/gamecode/actions", {
        action,
        gameCode: gameCode?.code,
      })
      .catch(console.error);

    setGameState(action === "start" ? "started" : "ended");
    setFetchedGameCode(true);
  };

  useEffect(() => {
    const fetchGameCode = async () => {
      const response = await fetch("/api/gamecode/create", {
        body: JSON.stringify({ createGameCode }),
        method: "POST",
      });
      setFetchedGameCode(true);
      const json = await response.json();
      if (response.ok) {
        setGameCode(json);
      } else if (response.status === 404) {
        setGameCode(null);
      } else if (response.status === 409) {
        setResponse({ status: 409, message: "Unused game code!" });
        if (!firstFetch) setOpen(true);
        if (firstFetch) setFirstFetch(false);
        console.log(json, response.ok);
        setGameCode(json);

        setTimeout(() => {
          setOpen(false);
        }, 2000);
      }
    };

    fetchGameCode();
  }, [createGameCode, date]);

  let isFetchingPlayers = false;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameCode) return;
      if (isFetchingPlayers) return;
      // if (gameCode.startedAt && users) return;
      isFetchingPlayers = true;
      const code = gameCode.code;
      axios
        .get(`/api/gamecode/${code}/users`)
        .then(({ data }) => {
          const users = data.users;
          setUsers(users);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          isFetchingPlayers = false;
        });
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
            {fetchedGameCode && gameCode && (
              <Typography variant="h1" sx={{ m: 2 }}>
                Your game code is:{" "}
                <strong className="uppercase">{gameCode.code}</strong>
              </Typography>
            )}
            {fetchedGameCode && !gameCode && (
              <Typography variant="h1" sx={{ m: 2 }}>
                No game code available
              </Typography>
            )}
            {!fetchedGameCode && <CircularProgress sx={{ m: 2 }} />}
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
                  disabled={false}
                  // disabled={gameState === "started"}
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
                  disabled={false}
                  // disabled={gameState !== "started"}
                >
                  End Game
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => router.push(`/game/${gameCode?.code}/stats`)}
                >
                  View Stats
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => router.push(`/game/${gameCode?.code}/gallery`)}
                >
                 Photo-Booth
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <Paper
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "50%",
              overflow: "auto",
              maxHeight: "20vh",
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
      <ErrorSuccessSnackbar open={open} response={response} />
    </main>
  );
}

export default AdminGameCode;
