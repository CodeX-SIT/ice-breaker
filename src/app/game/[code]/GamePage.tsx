"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Avatar from "avataaars";
import NavBar from "@/components/NavBar";
import Hobby, { AboutUserProps } from "@/components/Hobby";
import { AvatarProps } from "@/components/AvatarPreview";
import GameForm from "@/components/GameForm";

interface PageState {
  gameState?: "waiting" | "started" | "ended" | "notInGame";
  assigned?: any;
}

export default function GamePage({ code }: { code: string }) {
  const [state, setState] = useState<PageState>({});
  const router = useRouter();

  useEffect(() => {
    function fetchAssigned() {
      axios
        .get(`/api/user/game/${code}`)
        .then((response) => response.data)
        .then((data) => {
          setState({
            gameState: data.gameState,
            assigned: data.assigned,
          });
        })
        .catch((e) => {
          if (e.response) {
            // Invalid game code, so redirect to gamecode page
            router.push("/gamecode");
          } else {
            console.error(e);
          }
        });
    }
    fetchAssigned(); // first fetch
    const interval = setInterval(fetchAssigned, 1000);

    return () => clearInterval(interval); // clean up interval on component unmount
  }, [code]);

  switch (state.gameState) {
    case undefined:
      return <div>Page is loading...</div>;

    case "notInGame":
      router.push(`/gamecode?code=${code}`);
      return <div>You are not a part of this game.</div>;

    case "waiting":
      return <div>Waiting for the host to start the game...</div>;

    case "ended":
      // TODO: Show stats of the game.
      return <div>Game has ended.</div>;

    case "started":
      if (!state.assigned) {
        return <div>Waiting for next assignment...</div>;
      }

      const avatarProps: AvatarProps = state.assigned.assignedUser.avatar;
      const aboutUserProps: AboutUserProps =
        state.assigned.assignedUser.aboutUser;

      return (
        <>
          <NavBar />
          <Avatar {...avatarProps} />
          <Hobby aboutUser={aboutUserProps} />
          <GameForm code={code} assignedId={state.assigned.id} />
        </>
      );
  }
}
