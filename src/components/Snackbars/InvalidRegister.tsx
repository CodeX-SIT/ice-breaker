import React from "react";
import { Alert, Snackbar, Typography } from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";
import type { UserCreateResponse } from "@/actions/UserCreateResponse";

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
  return (
    <Snackbar open={open} TransitionComponent={SlideTransition}>
      <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
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
