"use client";

import NavBar from "@/components/NavBar";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import WebhookOutlinedIcon from "@mui/icons-material/WebhookOutlined";
import { MouseEventHandler, useState } from "react";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";
import { useRouter } from "next/navigation";

export function _GameCodePage() {
  const [gameCode, setGameCode] = useState("");
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({ status: 0, message: "" });
  const router = useRouter();

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/gamecode", {
      body: gameCode,
      method: "POST",
    });

    if (response.ok) {
      setResponse({
        status: 200,
        message: `Added you to the game ${gameCode}`,
      });
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        router.push(`/game`);
      }, 3000);
    } else if ([401, 403].includes(response.status)) {
      router.replace("/auth/signin");
    } else if ([400, 404].includes(response.status)) {
      setResponse({ status: 400, message: "Invalid game code." });
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } else if (response.status === 409) {
      setResponse({
        status: 409,
        message: response.statusText,
      });
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } else {
      setResponse({
        status: 500,
        message: "There was an internal server error. Please contact support.",
      });
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  };
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
                  onChange={(e) => {
                    setGameCode(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2, width: "50%" }}
              onClick={handleSubmit}
            >
              <Typography>Submit</Typography>
            </Button>
          </Paper>
        </Box>
      </section>
      <ErrorSuccessSnackbar open={open} response={response} />
    </main>
  );
}
