"use client";

import NavBar from "@/components/NavBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import createUser from "@/actions/createUser";

export default function RegisterPage() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const { pending: formPending } = useFormStatus();

  const [allowSubmit, setAllowSubmit] = useState(false);

  useEffect(() => {
    if (
      fname &&
      lname &&
      email &&
      password &&
      passwordVerify &&
      password === passwordVerify
    ) {
      setAllowSubmit(true);
    } else {
      setAllowSubmit(false);
    }
  }, [fname, lname, email, password, passwordVerify]);

  const handleSubmit = (data: FormData) => {
    fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
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
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form
              className="m-4 flex flex-col items-center"
              action={createUser}
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
                    onChange={(e) => setFname(e.target.value)}
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
                    onChange={(e) => setLname(e.target.value)}
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
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
                    onChange={(e) => setPasswordVerify(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!allowSubmit || formPending}
                sx={{ mt: 3, mb: 2, width: "50%" }}
              >
                {formPending ? "Loading..." : "Sign Up"}
              </Button>
            </form>
          </Paper>
        </Box>
      </section>
    </main>
  );
}
