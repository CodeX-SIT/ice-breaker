import dynamic from "next/dynamic";
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { Button, Box, Typography } from "@mui/material";
import { AvatarProps } from "@/components/AvatarPreview";
import axios from "axios";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AvatarPage from "./AvatarPage";

const AvatarChooser = dynamic(() => import("@/components/AvatarChooser"), {
  ssr: false,
});

export default async function () {
  const session = await auth();

  if (!session?.user?.id) redirect("/auth/login");

  const userId = session?.user?.id;

  return <AvatarPage userId={userId} />;
}
