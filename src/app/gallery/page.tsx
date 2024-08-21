/* eslint-disable @next/next/no-img-element */
"use server";

import NavBar from "@/components/NavBar";
import { AboutUser, Assigned, Selfie, UserGame } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { redirect, RedirectType } from "next/navigation";
import LaunchIcon from "@mui/icons-material/Launch";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import React from "react";
import { InferAttributes, or } from "sequelize";

export default async function GalleryPage() {
  const session = await checkAuthAndRedirect();
  const userGame = await UserGame.findOne({
    where: { userId: session.user!.id! },
  });
  if (!userGame) {
    return (
      <>
        <NavBar />
        <form
          className="flex h-screen w-screen justify-center items-center flex-col"
          action={() => {
            "use server";
            redirect("/gamecode", RedirectType.replace);
          }}
        >
          <Typography>Play a game to unlock the gallery!</Typography>
          <Button
            variant="contained"
            startIcon={<LaunchIcon />}
            type="submit"
            sx={{ mt: 2 }}
          >
            Play a game
          </Button>
        </form>
      </>
    );
  }

  const assignments = await Assigned.findAll({
    where: or(
      { userId: session.user!.id },
      { assignedUserId: session.user!.id },
    ),
  });
  let selfies: Record<
    Selfie["id"],
    InferAttributes<Selfie> & { assignedString: string }
  > = {};
  for (const assignment of assignments) {
    const _selfies = await Selfie.findAll({
      where: { assignedId: assignment.id },
    });
    const userIsAssignedUser = assignment.userId === session.user!.id;
    const assignedUser = await AboutUser.findOne({
      where: {
        userId: userIsAssignedUser
          ? assignment.assignedUserId
          : assignment.userId,
      },
    });
    for (const selfie of _selfies) {
      selfies[selfie.id] = {
        ...selfie.toJSON(),
        assignedString: assignedUser!.name,
      };
    }
  }

  if (Object.keys(selfies).length === 0) {
    return (
      <>
        <NavBar />
        <form
          className="flex h-screen w-screen justify-center items-center flex-col"
          action={() => {
            "use server";
            redirect("/gamecode", RedirectType.replace);
          }}
        >
          <Typography>
            Take some photos when you play the game to unlock the gallery!
          </Typography>
          <Button
            variant="contained"
            startIcon={<LaunchIcon />}
            type="submit"
            sx={{ mt: 2 }}
          >
            Play a game
          </Button>
        </form>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <ImageList variant="masonry" sx={{ p: 1, pt: 8 }}>
        {Object.values(selfies).map((selfie) => (
          <ImageListItem
            key={selfie.id}
            sx={{ border: "1px solid", borderRadius: 1 }}
          >
            <img
              className="max-w-64"
              src={`data:${selfie.mimeType};base64,${selfie.data.toString(
                "base64",
              )}`}
              alt={`Selfie for ${selfie.assignedId}`}
            />
            <ImageListItemBar
              title={selfie.assignedString}
              sx={{
                borderRadius: 1,
                backdropFilter: "blur(16px)",
                m: 0.5,
              }}
              actionIcon={
                <form
                  action={`/api/selfie-download/${selfie.id}/${selfie.assignedString}`}
                  method="get"
                >
                  <IconButton type="submit">
                    <DownloadIcon color={"info"} />
                  </IconButton>
                </form>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
