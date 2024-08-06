"use client";

import { Toolbar, IconButton, AppBar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import Image from "next/image";
import ActionDrawer from "./ActionDrawer";

export default function NavBar() {
  const [open, setOpen] = React.useState(false);

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
          <div className="flex flex-grow" />
          <Image
            src={"/images/CodeXDark20PxPad.png"}
            alt="CodeX Logo"
            width={147.5}
            height={50}
          />
        </Toolbar>
      </AppBar>
      <ActionDrawer open={open} toggleDrawer={(open) => () => setOpen(open)} />
    </React.Fragment>
  );
}
