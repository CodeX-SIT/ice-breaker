"use client";

import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import axios from "axios";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";
import { AboutUser } from "@/database";
import { InferAttributes } from "sequelize";
import SubmitterButton from "@/components/Button/SubmitterButton";

const FUTURE_SNARKS = [
  "Born in the future, are we? Time travel much?",
  "Predicting the future, huh? Try a date that's already happened.",
  "Unless you're a time traveler, that date won't work!",
  "Got a crystal ball? Because that date is yet to come.",
  "Back from the future, are we? Pick a real birthdate!",
];

const PAST_SNARKS = [
  "Did you know dinosaurs? That date's a bit too ancient.",
  "Unless you're a vampire, that birthdate's too old!",
  "Were you friends with Methuselah? Enter a more recent date.",
  "That's a bit pre-historic, don't you think? Try again.",
  "Did you come with the pyramids? Event Egyptians knew time better than you!",
];

export default function _HobbiesPage({
  previousAboutMe,
}: {
  previousAboutMe: InferAttributes<AboutUser> | null;
}) {
  const [open, setOpen] = React.useState(false);
  const [response, setResponse] = React.useState({ status: 0, message: "" });
  const [name, setName] = React.useState(previousAboutMe?.name || "");
  const [dateOfBirth, setDateOfBirth] = React.useState(
    previousAboutMe?.dateOfBirth || new Date(),
  );
  const [homeTown, setHomeTown] = React.useState(
    previousAboutMe?.homeTown || "",
  );
  const [hobbies, setHobbies] = React.useState(previousAboutMe?.hobbies || "");
  const [guiltyPleasures, setGuiltyPleasures] = React.useState(
    previousAboutMe?.guiltyPleasures || "",
  );
  const [favoriteMovies, setFavoriteMovies] = React.useState(
    previousAboutMe?.favoriteMovies || "",
  );
  const [favoriteSongs, setFavoriteSongs] = React.useState(
    previousAboutMe?.favoriteSongs || "",
  );
  const [disable, setDisable] = React.useState(false);
  const [interactive, setInteractive] = React.useState(false);

  const router = useRouter();

  useEffect(() => {
    setInteractive(true);
  }, []);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setDisable(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dateOfBirth", dateOfBirth.toISOString());
    formData.append("homeTown", homeTown);
    formData.append("hobbies", hobbies);
    formData.append("guiltyPleasures", guiltyPleasures);
    formData.append("favoriteMovies", favoriteMovies);
    formData.append("favoriteSongs", favoriteSongs);

    handleSubmit(formData);
  };

  const handleSubmit = async (data: FormData) => {
    if (
      !name ||
      !dateOfBirth ||
      !homeTown ||
      !hobbies ||
      !guiltyPleasures ||
      !favoriteMovies ||
      !favoriteSongs
    ) {
      handleError(400, "Please fill out all fields.");
      return;
    }

    if (dateOfBirth > new Date()) {
      handleError(400, FUTURE_SNARKS[Math.floor(Math.random() * 5)]);
      return;
    }

    if (dateOfBirth < new Date("1920-01-01")) {
      handleError(400, PAST_SNARKS[Math.floor(Math.random() * 5)]);
      return;
    }

    const response = await fetch("/api/hobbies", {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      handleSuccess();
    } else if ([401, 403].includes(response.status)) {
      router.push("/auth/signin");
    } else if (String(response.status).startsWith("5")) {
      handleError(
        500,
        "There was an internal server error. Please contact support.",
      );
    } else {
      handleError(400, "There was an error. Please try again!");
    }
  };

  const handleError = (status: number, message: string) => {
    setDisable(false);
    setResponse({ status, message });
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  const handleSuccess = () => {
    setDisable(false);
    setResponse({ status: 201, message: "Hobbies saved!" });
    setOpen(true);
    setInteractive(false);
    setTimeout(() => {
      setOpen(false);
      router.push("/aboutme/avatar");
    }, 2000);
  };

  if (!interactive) {
    return (
      <>
        <section className="flex h-screen w-screen justify-center items-center">
          <CircularProgress />
        </section>
        <ErrorSuccessSnackbar open={open} response={response} />
      </>
    );
  }

  return (
    <main>
      <NavBar />
      <section className="flex h-screen w-screen justify-center items-center">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            width: "90%",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "auto",
              maxHeight: "80vh",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ m: 2 }}>
              About Me
            </Typography>
            <form className="p-4 flex flex-col items-center">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    color="primary"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    defaultValue={previousAboutMe?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="dateOfBirth"
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setDateOfBirth(new Date(e.target.value));
                    }}
                    defaultValue={previousAboutMe?.dateOfBirth}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="homeTown"
                    label="Home Town"
                    name="homeTown"
                    autoComplete="address-level2"
                    color="primary"
                    onChange={(e) => {
                      setHomeTown(e.target.value);
                    }}
                    defaultValue={previousAboutMe?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="hobbies"
                    label="Hobbies"
                    name="hobbies"
                    autoComplete="off"
                    multiline
                    onChange={(e) => {
                      setHobbies(e.target.value);
                    }}
                    defaultValue={previousAboutMe?.hobbies}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="guiltyPleasures"
                    label="Guilty Pleasures"
                    name="guiltyPleasures"
                    autoComplete="off"
                    multiline
                    onChange={(e) => {
                      setGuiltyPleasures(e.target.value);
                    }}
                    defaultValue={previousAboutMe?.guiltyPleasures}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="favoriteMovies"
                    label="Favorite Movies"
                    name="favoriteMovies"
                    autoComplete="off"
                    multiline
                    onChange={(e) => {
                      setFavoriteMovies(e.target.value);
                    }}
                    defaultValue={previousAboutMe?.favoriteMovies}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="favoriteSongs"
                    label="Favorite Songs"
                    name="favoriteSongs"
                    autoComplete="off"
                    multiline
                    onChange={(e) => {
                      setFavoriteSongs(e.target.value);
                    }}
                    defaultValue={previousAboutMe?.favoriteSongs}
                  />
                </Grid>
              </Grid>
              <SubmitterButton
                text="Submit"
                disable={disable}
                handleSubmit={onClick}
                sx={{ mt: 2, width: "50%" }}
              />
            </form>
          </Paper>
        </Box>
        <ErrorSuccessSnackbar open={open} response={response} />
      </section>
    </main>
  );
}
