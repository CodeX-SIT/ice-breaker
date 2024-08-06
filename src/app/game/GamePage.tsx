"use client";
import { AvatarProps } from "@/components/AvatarPreview";
import { useEffect, useState } from "react";
import Avatar from "avataaars";
import axios from "axios";
import Hobby, { AboutUserProps } from "@/components/Hobby";
import NavBar from "@/components/NavBar";

export default function GamePage() {
  const [assigned, setAssigned] = useState<any>();

  useEffect(() => {
    axios
      .get("/api/user/assigned")
      .then((response) => {
        if (!response.data) {
          // this means that user is in a game but there is no assignment right now
          // OR game has not started yet
          // read assigned route
          return setAssigned(null);
        }
        setAssigned(response.data.assignedUser);
      })
      .catch((e) => {
        // redirect to gameCode page
        console.error(e.response);
      });
  }, []);

  if (!assigned)
    // TODO: Redirect user to game waiting page
    return <div>Waiting for game to start... or Please enter a game code</div>;

  const avatarProps: AvatarProps = assigned.avatar;
  const aboutUserProps: AboutUserProps = assigned.aboutUser;

  return (
    <>
      <NavBar />
      <Avatar {...avatarProps} />
      <Hobby aboutUser={aboutUserProps} />
    </>
  );
}
