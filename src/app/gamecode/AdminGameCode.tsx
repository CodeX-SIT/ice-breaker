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

// Flash Events data (matching flashEvents.json exactly)
const flashEventsData = [
  {
    id: "silent_treatment",
    name: "🤫 Silent Hunt",
    description:
      "No talking allowed! Use gestures, expressions, and creativity to find your target!",
    duration: 45,
    instructions:
      "You cannot speak for the next 45 seconds. Use hand gestures, facial expressions, or write notes. Get creative with your communication!",
  },
  {
    id: "whisper_mode",
    name: "🗣️ Whisper Challenge",
    description:
      "Shhh! All conversations must be whispered for the next 45 seconds!",
    duration: 45,
    instructions:
      "All communication must be whispered. Get close to people to talk. Create intimate conversations. Secrets are more fun when whispered...",
  },
  {
    id: "animal_kingdom",
    name: "🦁 Animal Kingdom",
    description:
      "Communicate only through animal sounds and movements! Roar, chirp, or hop your way to victory!",
    duration: 60,
    instructions:
      "No human words allowed! Choose an animal and embody it. Make animal sounds and movements. The wildest hunter wins!",
  },
  {
    id: "mirror_match",
    name: "🪞 Mirror Mirror",
    description:
      "Copy the movements of the person you're talking to! Mirror their gestures and expressions!",
    duration: 40,
    instructions:
      "Mirror every movement of people you interact with. Copy their gestures and expressions. Make conversations hilariously awkward!",
  },
  {
    id: "compliment_cascade",
    name: "💝 Compliment Cascade",
    description:
      "Every conversation must start with a genuine compliment! Spread the positivity!",
    duration: 50,
    instructions:
      "Start every interaction with a sincere compliment. Make people feel amazing about themselves. Spread joy and positivity!",
  },
  {
    id: "robot_mode",
    name: "🤖 Robot Takeover",
    description:
      "BEEP BOOP! All humans must now communicate like robots for optimal efficiency!",
    duration: 45,
    instructions:
      "INITIATING ROBOT MODE. ALL COMMUNICATION MUST BE ROBOTIC. USE MECHANICAL MOVEMENTS. BEEP AND BOOP FREQUENTLY. EMOTION CIRCUITS DISABLED.",
  },
  {
    id: "rhyme_time",
    name: "🎵 Rhyme Time",
    description:
      "Every sentence must end with a rhyme! Make your words flow and shine!",
    duration: 40,
    instructions:
      "Every sentence you speak must rhyme with something. Get creative with your wordplay. Make conversations poetic and fun!",
  },
  {
    id: "superhero_stance",
    name: "🦸 Hero Hour",
    description:
      "Strike dramatic superhero poses while talking! Save the day with style!",
    duration: 35,
    instructions:
      "Strike a superhero pose every time you talk to someone. Cape flowing, hands on hips, dramatic stances only! Be the hero this game needs!",
  },
  {
    id: "emoji_only",
    name: "😀 Emoji Express",
    description:
      "Communication through facial expressions only! Let your face do the talking!",
    duration: 30,
    instructions:
      "No words allowed! Use only facial expressions and gestures. Become a human emoji. Express everything through your face!",
  },
];

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
  const [flashEvents, setFlashEvents] = React.useState<any[]>([]);
  const [activeFlashEvent, setActiveFlashEvent] = React.useState<any>(null);

  React.useEffect(() => {
    setFlashEvents(flashEventsData);
  }, []);

  const triggerFlashEvent = async (eventId: string) => {
    if (!gameCode) return;

    try {
      setResponse({ status: 1000, message: "Triggering flash event..." });
      setOpen(true);

      const response = await axios.post("/api/flashevents/trigger", {
        gameCodeId: gameCode.id,
        eventId: eventId,
        adminId: gameCode.userId,
      });

      setResponse({ status: 200, message: "Flash event triggered!" });
      setActiveFlashEvent(response.data.flashEvent);
      setTimeout(() => setOpen(false), 2000);
    } catch (error) {
      console.error("Error triggering flash event:", error);
      setResponse({ status: 500, message: "Failed to trigger flash event" });
      setTimeout(() => setOpen(false), 3000);
    }
  };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createGameCode, date]);

  let isFetchingPlayers = false;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameCode) return;
      if (isFetchingPlayers) return;
      // if (gameCode.startedAt && users) return;
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <section className="flex w-screen justify-center">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            width: "90%",
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "calc(100vh - 120px)",
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

          {/* Flash Events Controls */}
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
            <Typography variant="h4" sx={{ mb: 2 }}>
              Flash Events
            </Typography>
            {activeFlashEvent && (
              <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
                Active:{" "}
                {
                  flashEventsData.find((e) => e.id === activeFlashEvent.eventId)
                    ?.name
                }
              </Typography>
            )}
            <Grid container spacing={2}>
              {flashEvents.map((event) => (
                <Grid item xs={12} key={event.id}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => triggerFlashEvent(event.id)}
                    disabled={!!activeFlashEvent}
                    sx={{
                      textAlign: "left",
                      justifyContent: "flex-start",
                      p: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" component="div">
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description} ({event.duration}s)
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
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
