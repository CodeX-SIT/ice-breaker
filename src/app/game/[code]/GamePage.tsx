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

type GameStates = "waiting" | "started" | "ended" | "notInGame";

export default function GamePage({ code }: { code: string }) {
  const [assigned, setAssigned] = useState<any>();
  const [gameState, setGameState] = useState<GameStates>();
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({ status: 0, message: "" });
  const [fetchNext, setFetchNext] = useState(true);
  const router = useRouter();

  const handleSnackbar = (open: boolean, status?: number, message?: string) => {
    setOpen(open);
    setResponse((prevState) => ({
      status: status || prevState.status,
      message: message || prevState.message,
    }));
  };

  const resetAssigned = () => {
    setAssigned(undefined);
  };

  useEffect(() => {
    let isFetching = false; // to track if a request is in progress

    function fetchAssigned() {
      if (isFetching) return; // skip if a request is already in progress
      isFetching = true; // mark as fetching
      axios
        .get(`/api/user/game/${code}?assignedId=${assigned?.id}`)
        .then(({ data }) => {
          if (data === "VALID") return;
          if (data === "COMPLETED") {
            return router.push(`/game/completed`);
          }
          setGameState(data.gameState);
          setAssigned(data.assigned);
        })
        .catch((e) => {
          console.log(e.response);
          console.log(e.stack);
          router.push(`/gamecode?code=${code}`);
        })
        .finally(() => {
          isFetching = false; // reset the fetching status
        });
    }

    fetchAssigned(); // first fetch
    const interval = setInterval(fetchAssigned, 1000);

    if (gameState === "ended") {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // clean up interval on component unmount
  }, [code, assigned, gameState]);

  switch (gameState) {
    case undefined:
      return (
        <>
          <NavBar />
          <ErrorSuccessSnackbar
            open={true}
            response={{
              status: 1000,
              message: "Page is loading.",
            }}
          />
        </>
      );

    case "notInGame":
      router.push(`/gamecode?code=${code}`);
      return <div>You are not a part of this game.</div>;

    case "waiting":
      return (
        <>
          <NavBar />
          <ErrorSuccessSnackbar
            open={true}
            response={{
              status: 1000,
              message: "Waiting for host to start the game.",
            }}
          />
        </>
      );

    case "ended":
      return (
        <>
          <NavBar />
          <ErrorSuccessSnackbar
            open={true}
            response={{
              status: 200,
              message: "Game has ended.",
            }}
          />
        </>
      );

    case "started":
      if (!assigned) {
        return (
          <>
            <NavBar />
            <ErrorSuccessSnackbar
              open={true}
              response={{
                status: 1000,
                message: "Waiting for next assignment.",
              }}
            />
          </>
        );
      }

      const avatarProps: AvatarProps = assigned.assignedUser.avatar;
      const aboutUserProps: AboutUserProps = assigned.assignedUser.aboutUser;

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
            assignedId={assigned.id}
            handleSnackbar={handleSnackbar}
            resetAssigned={resetAssigned}
          />
          <ErrorSuccessSnackbar
            open={open}
            response={{ status: response.status, message: response.message }}
          />
        </>
      );
  }
}
