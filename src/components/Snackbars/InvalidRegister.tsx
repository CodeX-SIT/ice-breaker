import React from "react";
import { Alert, Snackbar, Typography } from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";
import type { UserCreateResponse } from "@/actions/UserCreateResponse";
import { redirect } from "next/navigation";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export default function InvalidRegister({
  open,
  userCreateResponse,
}: {
  open: boolean;
  userCreateResponse: UserCreateResponse;
}) {
  if (userCreateResponse.status === 409) {
    setTimeout(() => {
      redirect("/login");
    }, 5000);
  }
  return (
    <Snackbar open={open} TransitionComponent={SlideTransition}>
      <Alert
        severity={userCreateResponse.status === 409 ? "success" : "error"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        <Typography>{userCreateResponse.body.message}</Typography>
        {userCreateResponse.status === 400 ? (
          <Typography>
            {userCreateResponse.body.errors.map((error) => (
              <Typography key={error.message}>{error.message}</Typography>
            ))}
          </Typography>
        ) : (
          ""
        )}
      </Alert>
    </Snackbar>
  );
}
