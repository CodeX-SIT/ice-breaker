"use client";

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { Avatar } from "@mui/material";

export default function NavBar() {
  return (
    <SessionProvider>
      <_NavBar />
    </SessionProvider>
  );
}
function _NavBar() {
  const { data: session } = useSession();
  return (
    <AppBar position="absolute">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <div className="flex flex-grow" />
        <Avatar src={session?.user?.image ?? ""} />
      </Toolbar>
    </AppBar>
  );
}
