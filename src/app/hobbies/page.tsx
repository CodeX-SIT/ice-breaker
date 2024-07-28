"use client";

import React from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import NavBar from "@/components/NavBar";

const HobbiesPage = () => {
  const Container = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: theme.palette.background.default,
  }));

  return (
    <main>
      <NavBar />
      <Container>
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
            <Typography component="h1" variant="h5">
              Hobbies Page
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
                    autoFocus
                    color="primary"
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="favoriteMusicians"
                    label="Favorite Musicians"
                    name="favoriteMusicians"
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "50%" }}
              >
                <Typography>Submit</Typography>
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </main>
  );
};

export default HobbiesPage;
