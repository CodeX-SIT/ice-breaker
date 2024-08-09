"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import Avatar from "avataaars";
import NavBar from "@/components/NavBar";
import Hobby, { AboutUserProps } from "@/components/Hobby";
import GameForm from "@/components/GameForm";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";
import { AvatarProps } from "@/components/AvatarPreview";
import CustomConfetti from "@/components/CustomConfetti";

type GameStates = "waiting" | "started" | "ended" | "notInGame" | "completed";

export default function GamePage({ code }: { code: string }) {
  const [assigned, setAssigned] = useState<any>();
  const [gameState, setGameState] = useState<GameStates>();
  const [open, setOpen] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [response, setResponse] = useState({ status: 0, message: "" });
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

    const fetchAssigned = async () => {
      if (isFetching) return; // skip if a request is already in progress
      isFetching = true;

      try {
        const { data } = await axios.get(
          `/api/user/game/${code}?assignedId=${assigned?.id}`,
        );
        if (data === "VALID") return;
        if (data === "COMPLETED") {
          setGameState("completed");
          return;
        }
        setGameState(data.gameState);
        setAssigned(data.assigned);
      } catch (e: any) {
        console.error(e.response, e.stack);
        router.push(`/gamecode?code=${code}`);
      } finally {
        isFetching = false;
      }
    };

    fetchAssigned();
    const interval = setInterval(fetchAssigned, 1000);

    if (gameState === "ended") {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // clean up interval on component unmount
  }, [code, assigned, gameState]);

  useEffect(() => {
    setInteractive(true);
  }, []);

  if (!interactive) {
    return (
      <section className="flex h-screen w-screen justify-center items-center">
        <CircularProgress />
      </section>
    );
  }

  const renderContent = () => {
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

      case "completed":
        return (
          <>
            <NavBar />
            <CustomConfetti run={true} />
            <ErrorSuccessSnackbar
              open={true}
              response={{
                status: 200,
                message: "You've found everybody.",
              }}
            />
          </>
        );
      case "ended":
        router.push(`/game/${code}/ended`);

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
  };

  return renderContent();
}
