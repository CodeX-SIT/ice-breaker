"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Avatar from "avataaars";
import NavBar from "@/components/NavBar";
import Hobby, { AboutUserProps } from "@/components/Hobby";
import { AvatarProps } from "@/components/AvatarPreview";
import GameForm from "@/components/GameForm";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";

interface PageState {
  gameState?: "waiting" | "started" | "ended" | "notInGame";
  assigned?: any;
}

export default function GamePage({ code }: { code: string }) {
  const [state, setState] = useState<PageState>({});
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({ status: 0, message: "" });
  const router = useRouter();
  const assigned = state.assigned;
  const gameState = state.gameState;

  const handleSnackbar = (open: boolean, status?: number, message?: string) => {
    setOpen(open);
    setResponse((prevState) => {
      return {
        status: status || prevState.status,
        message: message || prevState.message,
      };
    });
  };

  useEffect(() => {
    function fetchAssigned() {
      axios
        .get(`/api/user/game/${code}?assignedId=${assigned?.id}`)
        .then(({ data }) => {
          if (data === "VALID") return;
          if (data === "WAITING") {
            // this will never happen
            return setState({ gameState: "started", assigned: null });
          }
          if (data === "COMPLETED") {
            return router.push(`/game/completed`);
          }
          setState({
            gameState: data.gameState,
            assigned: data.assigned,
          });
        })
        .catch((e) => {
          if (e.response) {
            // Invalid game code, so redirect to gamecode page
            router.push(`/gamecode?code=${code}`);
          } else {
            console.error(e);
          }
        });
    }
    fetchAssigned(); // first fetch
    const interval = setInterval(fetchAssigned, 1000);
    if (gameState === "ended") {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // clean up interval on component unmount
  }, [code, assigned, gameState]);

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
          <section
            className="flex w-screen justify-center items-center"
            style={{ marginTop: "70px" }}
          >
            <Avatar {...avatarProps} />
          </section>

          <Hobby aboutUser={aboutUserProps} />
          <GameForm
            code={code}
            assignedId={state.assigned.id}
            handleSnackbar={handleSnackbar}
          />
          <ErrorSuccessSnackbar
            open={open}
            response={{ status: response.status, message: response.message }}
          />
        </>
      );
  }
}
