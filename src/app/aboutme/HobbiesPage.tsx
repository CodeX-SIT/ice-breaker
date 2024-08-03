"use client";

import React from "react";
import { Box, Button, TextField, Grid, Paper, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import InvalidHobbies from "@/components/Snackbars/InvalidHobbies";

export default function _HobbiesPage() {
  const [open, setOpen] = React.useState(false);
  const [response, setResponse] = React.useState({ status: 0, message: "" });
  const [name, setName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState(new Date());
  const [hobbies, setHobbies] = React.useState("");
  const [guiltyPleasures, setGuiltyPleasures] = React.useState("");
  const [favoriteMovies, setFavoriteMovies] = React.useState("");
  const [favoriteSongs, setFavoriteSongs] = React.useState("");

  const router = useRouter();

  const onClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("dateOfBirth", dateOfBirth.toISOString());
    formData.append("hobbies", hobbies);
    formData.append("guiltyPleasures", guiltyPleasures);
    formData.append("favoriteMovies", favoriteMovies);
    formData.append("favoriteSongs", favoriteSongs);
    handleSubmit(formData);
  };

  const handleSubmit = async (data: FormData) => {
    const response = await fetch("/api/hobbies", {
      method: "POST",
      body: data,
    });

    console.log(data);

    if (response.ok) {
      setResponse({ status: 201, message: "Hobbies saved!" });
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        router.push("/aboutme/avatar");
      }, 3000);
    } else if (response.status === 400) {
      setResponse({
        status: 400,
        message: "There was an error. Please try again!",
      });
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } else if ([401, 403].includes(response.status)) {
      router.push("/auth/signin");
    }
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
              overflow: "auto",
              maxHeight: "80vh",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ marginTop: 2 }}>
              About Me
            </Typography>
            <form className="m-4 flex flex-col items-center">
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
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "50%" }}
                onClick={onClick}
              >
                <Typography>Submit</Typography>
              </Button>
            </form>
          </Paper>
        </Box>
        <InvalidHobbies open={open} response={response} />
      </section>
    </main>
  );
}
