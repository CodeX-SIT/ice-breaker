"use client";
import { AvatarProps } from "@/components/AvatarPreview";
import { useEffect, useState } from "react";
import Avatar from "avataaars";
import axios from "axios";
import Hobby, { AboutUserProps } from "@/components/Hobby";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function GamePage({ code }: { code: string }) {
  const [assigned, setAssigned] = useState<any>();
  type GameStates = "waiting" | "started" | "ended" | "notInGame";
  const [gameState, setGameState] = useState<GameStates>();
  const router = useRouter();

  useEffect(() => {
    function fetchAssigned() {
      axios
        .get(`/api/user/game/${code}`)
        .then((response) => response.data)
        .then((data) => {
          setGameState(data.gameState);
          setAssigned(data.assigned);
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

    fetchAssigned(); // first fetch needs to be done (otherwise it will be called after 1 second)
    const interval = setInterval(fetchAssigned, 3000);

    return () => clearInterval(interval); // this will delete the interval when the component is unmounted
  }, []);

  switch (gameState) {
    case null || undefined:
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
      if (!assigned) {
        return <div>Waiting for next assignment...</div>;
      }

      const avatarProps: AvatarProps = assigned.avatar;
      const aboutUserProps: AboutUserProps = assigned.aboutUser;

      // TODO: Upload selfie button
      // TODO: Name button
      // TODO: Submit button
      return (
        <>
          <NavBar />
          <Avatar {...avatarProps} />
          <Hobby aboutUser={aboutUserProps} />
        </>
      );

    default:
      return <div>Invalid game state.</div>;
  }
}
