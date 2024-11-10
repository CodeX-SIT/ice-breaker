"use client";

import { Toolbar, IconButton, AppBar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useEffect } from "react";
import Image from "next/image";
import ActionDrawer from "./ActionDrawer";
import axios from "axios";

export default function NavBar({
  variant = "name",
}: {
  variant?: "name" | "induction";
}) {
  const [open, setOpen] = React.useState(false);
  const [about, setAbout] = React.useState<any>();

  useEffect(() => {
    axios.get("/api/user/about").then(({ data }) => {
      setAbout(data);
    });
  }, []);

  return (
    <React.Fragment>
      <AppBar position="absolute">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          {variant === "name" ? (
            <Typography>{about && about.name}</Typography>
          ) : (
            <Typography>{"Induction"}</Typography>
          )}
          <div className="flex flex-grow" />
          {/* <Image
            src={"/images/CodeXDark20PxPad.png"}
            alt="CodeX Logo"
            width={147.5}
            height={50}
          /> */}
        </Toolbar>
      </AppBar>
      <ActionDrawer open={open} toggleDrawer={(open) => () => setOpen(open)} />
    </React.Fragment>
  );
}
