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
import LogOutIcon from "@mui/icons-material/Logout";
import React from "react";
import signOutAction from "./signOutAction";

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
  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <List disablePadding>
          <DrawerItem text="Edit Aboutme" icon={<EditIcon />} />
          <DrawerItem text="Edit Avatar" icon={<AvatarIcon />} />
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
