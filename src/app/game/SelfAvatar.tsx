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

interface PageState {
  avatar?: AvatarProps;
  loading: boolean;
  error: boolean;
}

export default function SelfAvatar() {
  const [state, setState] = useState<PageState>({
    avatar: undefined,
    loading: true,
    error: false,
  });

  useEffect(() => {
    axios(`/api/user/avatar`, {
      method: "GET",
    })
      .then((response) => {
        setState({ avatar: response.data, loading: false, error: false });
      })
      .catch((err) => {
        console.error(JSON.stringify(err, null, 2));
        setState({ avatar: undefined, loading: false, error: true });
      });
  }, []);

  if (state.loading) return <div>Loading...</div>;
  if (state.error) return <div>Avatar could not be fetched.</div>;
  if (!state.avatar) return <div>Avatar not found.</div>;
  return (
    <>
      <NavBar />
      <Avatar {...state.avatar} />
    </>
  );
}
