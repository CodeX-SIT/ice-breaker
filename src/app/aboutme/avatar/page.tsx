"use client";
import dynamic from "next/dynamic";
import React from "react";
import NavBar from "@/components/NavBar";
import { Button, Box, Typography } from "@mui/material";

const AvatarChooser = dynamic(
  () => import("@/components/AvatarChooser"),
  {
    ssr: false,
  },
);

function CreateAvatarPage() {
  return (
    <main>
      <NavBar />
      <section className="mt-16">
        <Typography component="h1" variant="h6" textAlign="center">
          Create Your Avatar
        </Typography>
        <AvatarChooser />
        <Box textAlign="center">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, width: "50%" }}
          >
            <Typography>Finish</Typography>
          </Button>
        </Box>
      </section>
    </main>
  );
}

export default CreateAvatarPage;