"use client";

import React, { useEffect } from "react";
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
import hobbySubmit, { HobbySubmitReturnType } from "@/actions/hobbySubmit";
import { useFormState } from "react-dom";
import InvalidHobbies from "@/components/Snackbars/InvalidHobbies";
import { useRouter } from "next/navigation";

const HobbiesPage = () => {
  const [state, formAction] = useFormState(hobbySubmit, {
    error: "defaultError",
    success: false,
  } as HobbySubmitReturnType);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.error === "defaultError") return;
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
    setTimeout(() => {
      router.push("/");
    }, 4000);
  }, [state]);

  return (
    <main>
      <NavBar />
      <section className="flex h-screen w-screen justify-center items-center">
        {/* <Container> */}
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
              Hobbies Page
            </Typography>
            <form
              className="m-4 flex flex-col items-center"
              action={formAction}
            >
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
                    multiline
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
                    multiline
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
        <InvalidHobbies open={open} hobbySubmitResponse={state} />
        {/* </Container> */}
      </section>
    </main>
  );
};

export default HobbiesPage;
