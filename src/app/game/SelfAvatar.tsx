"use client";
import NavBar from "@/components/NavBar";
import axios from "axios";
import Avatar from "avataaars";
import { useEffect, useState } from "react";
import { AvatarProps } from "@/components/AvatarPreview";

// Fetch the user's avatar
// Fetch the user's hobby
// Get the latest game that is the user is a part of
// Check if the game is on (validate gameCode)
// If not, redirect to gameCode page
// If it is, get the latest assignment
// If no uncompleted assignment, wait for the next assignment/game to start

export default function SelfAvatar() {
  const [avatar, setAvatar] = useState<AvatarProps>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios(`/api/user/avatar`, {
      method: "GET",
    })
      .then((response) => {
        setAvatar(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(JSON.stringify(err, null, 2));
        setLoading(false);
        setError(true);
      });
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Avatar could not be fetched.</div>;
  if (!avatar) return <div>Avatar not found.</div>;
  return (
    <>
      <NavBar />
      <Avatar {...avatar} />
    </>
  );
}
