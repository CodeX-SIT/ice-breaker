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

export function _GameCodePage() {
  const [gameCode, setGameCode] = useState("");

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/gamecode", {
      body: JSON.stringify({ gameCode }),
      method: "POST",
    });

    
  };
  return (
    <main>
      <NavBar />
      <section className="flex h-screen w-screen justify-center items-center">
        <Box
          sx={{
            marginTop: 8,
            width: "80%",
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <WebhookOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className="m-4 flex flex-col items-center">
              <Grid container spacing={2}>
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
                sx={{ mt: 3, mb: 2, width: "50%" }}
                onClick={handleSubmit}
              >
                <Typography>Submit</Typography>
              </Button>
            </form>
          </Paper>
        </Box>
      </section>
    </main>
  );
}
