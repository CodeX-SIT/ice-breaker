"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import { AvatarProps } from "@/components/AvatarPreview";
import axios from "axios";
import { InferAttributes } from "sequelize";
import { Avatar } from "@/database";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";
import { useRouter } from "next/navigation";

const AvatarChooser = dynamic(() => import("@/components/AvatarChooser"), {
  ssr: false,
});

export default function CreateAvatarPage({
  userId,
  previousAvatar,
}: {
  userId: string;
  previousAvatar: InferAttributes<Avatar> | null;
}) {
  const [avatarProps, setAvatarProps] = useState<AvatarProps>({
    avatarStyle: previousAvatar?.avatarStyle ?? "transparent",
    topType: previousAvatar?.topType ?? "NoHair",
    skinColor: previousAvatar?.skinColor ?? "Light",
    eyeType: previousAvatar?.eyeType ?? "Default",
    eyebrowType: previousAvatar?.eyebrowType ?? "Default",
    accessoriesType: previousAvatar?.accessoriesType ?? "Blank",
    mouthType: previousAvatar?.mouthType ?? "Default",
    hairColor: previousAvatar?.hairColor ?? "Brown",
    facialHairType: previousAvatar?.facialHairType ?? "Blank",
    facialHairColor: previousAvatar?.facialHairColor ?? "Brown",
    clotheType: previousAvatar?.clotheType ?? "BlazerShirt",
    clotheColor: previousAvatar?.clotheColor ?? "Black",
  });
  const [interactive, setInteractive] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [response, setResponse] = React.useState({ status: 0, message: "" });
  const router = useRouter();

  const handleSubmit = () => {
    axios(`/api/user/avatar`, {
      method: "POST",
      data: JSON.stringify(avatarProps),
    })
      .then(() => {
        setResponse({ status: 201, message: "Avatar saved!" });
        setOpen(true);
        setInteractive(false);
        setTimeout(() => {
          setOpen(false);
          router.push("/gamecode");
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
        setResponse({ status: 400, message: "Error saving avatar!" });
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      });
  };

  useEffect(() => {
    setInteractive(true);
  }, []);

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
      <ErrorSuccessSnackbar open={open} response={response} />
    </main>
  );
}
