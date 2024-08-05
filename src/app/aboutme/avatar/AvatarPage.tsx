"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { Button, Box, Typography } from "@mui/material";
import { AvatarProps } from "@/components/AvatarPreview";
import axios from "axios";
import { auth } from "@/auth";

const AvatarChooser = dynamic(() => import("@/components/AvatarChooser"), {
  ssr: false,
});

export default function CreateAvatarPage({ userId }: { userId: string }) {
  const [avatarProps, setAvatarProps] = useState<AvatarProps>({
    avatarStyle: "transparent",
    topType: "NoHair",
    skinColor: "Light",
    eyeType: "Default",
    eyebrowType: "Default",
    accessoriesType: "Blank",
    mouthType: "Default",
    hairColor: "Brown",
    facialHairType: "Blank",
    facialHairColor: "Brown",
    clotheType: "BlazerShirt",
    clotheColor: "Black",
  });

  const handleSubmit = () => {
    axios(`/api/user/avatar`, {
      method: "POST",
      data: JSON.stringify(avatarProps),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <main>
      <NavBar />
      <section className="mt-16">
        <Typography component="h1" variant="h6" textAlign="center">
          Create Your Avatar
        </Typography>
        <AvatarChooser
          avatarProps={avatarProps}
          setAvatarProps={setAvatarProps}
        />
        <Box textAlign="center">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, width: "50%" }}
            onClick={handleSubmit}
          >
            <Typography>Finish</Typography>
          </Button>
        </Box>
      </section>
    </main>
  );
}
