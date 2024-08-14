"use client";

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AvatarIcon from "@mui/icons-material/AccountCircle";
import GalleryIcon from "@mui/icons-material/PhotoLibrary";
import ControllerIcon from "@mui/icons-material/Gamepad";
import LogOutIcon from "@mui/icons-material/Logout";
import React from "react";
import signOutAction from "./signOutAction";
import { useRouter } from "next/navigation";

function DrawerItem({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <ListItem disablePadding disableGutters>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

function ActionDrawer({
  open,
  toggleDrawer,
}: {
  open: boolean;
  toggleDrawer: (open: boolean) => () => void;
}) {
  const router = useRouter();
  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <List disablePadding>
          <DrawerItem
            text="Edit Aboutme"
            icon={<EditIcon />}
            onClick={() => {
              router.push("/aboutme");
            }}
          />
          <DrawerItem
            text="Edit Avatar"
            icon={<AvatarIcon />}
            onClick={() => {
              router.push("/aboutme/avatar");
            }}
          />
          <DrawerItem
            text="View Gallery"
            icon={<GalleryIcon />}
            onClick={() => {
              router.push("/gallery");
            }}
          />
          <DrawerItem
            text="Play A Game"
            icon={<ControllerIcon />}
            onClick={() => {
              router.push("/gamecode");
            }}
          />
          <Divider />
          <DrawerItem
            text="Logout"
            icon={<LogOutIcon />}
            onClick={() => {
              signOutAction();
            }}
          />
        </List>
      </Drawer>
    </>
  );
}

export default ActionDrawer;
