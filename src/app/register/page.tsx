"use client";

import { useEffect, useState } from "react";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NavBar from "@/components/NavBar";
import { UserCreateResponse } from "@/actions/UserCreateResponse";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";

const initialState: UserCreateResponse = {
  status: 0,
  body: {
    message: "",
    errors: [],
  },
};

export default function RegisterPage() {
  console.log(process.env);
  return (
    <SessionProvider>
      <_RegisterPage />
    </SessionProvider>
  );
}

function _RegisterPage() {
  const { data: session } = useSession();
  
  const router = useRouter();

  if (session) {
    router.push("/");
  }

  useEffect(() => {}, []);

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
          </Paper>
        </Box>
      </section>
    </main>
  );
}
