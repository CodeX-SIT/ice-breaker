"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NavBar from "@/components/NavBar";
import createUser from "@/actions/createUser";
import { UserCreateResponse } from "@/actions/UserCreateResponse";
import InvalidRegister from "@/components/Snackbars/InvalidRegister";

const initialState: UserCreateResponse = {
  status: 0,
  body: {
    message: "",
    errors: [],
  },
};

export default function RegisterPage() {
  const [state, formAction] = useFormState(createUser, initialState);
  const [open, setOpen] = useState(false);

  const closeSnackbar = () => {
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  useEffect(() => {
    if (state.status === 201) {
    } else if (state.status === 400) {
      setOpen(true);
      closeSnackbar();
    }
  }, [state]);

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
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form
              className="m-4 flex flex-col items-center"
              action={formAction}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    autoFocus
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="passwordVerify"
                    label="Confirm Password"
                    name="passwordVerify"
                    type="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "50%" }}
              >
                <Typography>Sign Up</Typography>
              </Button>
            </form>
          </Paper>
        </Box>
        <InvalidRegister open={open} userCreateResponse={state} />
      </section>
    </main>
  );
}
