"use client";

import NavBar from "@/components/NavBar";
import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import WebhookOutlinedIcon from "@mui/icons-material/WebhookOutlined";
import { MouseEventHandler, useEffect, useState } from "react";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { isAxiosError } from "axios";
import SubmitterButton from "@/components/Button/SubmitterButton";

export function _GameCodePage() {
  const [gameCode, setGameCode] = useState("");
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({ status: 0, message: "" });
  const [interactive, setInteractive] = useState(false);
  const [disable, setDisable] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setInteractive(true);
    const code = searchParams.get("code") as string;
    // TODO: Set game code in the input field
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setDisable(true);

    try {
      const response = await axios.post("/api/gamecode", gameCode);
      setDisable(false);
      setOpen(true);
      setResponse({
        status: 200,
        message: `Redirecting you to ${gameCode.trim()}`,
      });
      router.push(`/game/${gameCode.trim()}`);
    } catch (error) {
      setDisable(false);

      if (!isAxiosError(error)) {
        console.error(error);
        return;
      }

      console.error(error);

      if (!error.response) {
        handleServerError();
        return;
      }

      const { status, statusText } = error.response;

      if ([401, 403].includes(status)) {
        router.replace("/auth/signin");
      } else if ([400, 404].includes(status)) {
        handleClientError("Invalid game code.");
      } else if (status === 409) {
        handleConflictError(statusText);
      } else {
        handleServerError();
      }
    }
  };

  const handleClientError = (message: string) => {
    setResponse({ status: 400, message });
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  const handleConflictError = (message: string) => {
    setResponse({ status: 409, message });
    router.push(`/game/${gameCode}`);
  };

  const handleServerError = () => {
    setResponse({
      status: 500,
      message: "There was an internal server error. Please contact support.",
    });
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  if (!interactive) {
    return (
      <section className="flex h-screen w-screen justify-center items-center">
        <CircularProgress />
      </section>
    );
  }

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
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <WebhookOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ m: 1, mt: 0 }}>
              Game Code
            </Typography>
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="gameCode"
                  label="Game Code"
                  name="gameCode"
                  autoFocus
                  color="primary"
                  // defaultValue={gameCode}
                  onChange={(e) => {
                    setGameCode(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <SubmitterButton
              text="Join"
              disable={disable}
              handleSubmit={handleSubmit}
              sx={{ mb: 2, width: "50%" }}
            />
          </Paper>
        </Box>
      </section>
      <ErrorSuccessSnackbar open={open} response={response} />
    </main>
  );
}
