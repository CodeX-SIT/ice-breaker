import React from "react";
import { Alert, Snackbar, Typography } from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";
import { redirect } from "next/navigation";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export default function InvalidHobbies({
  open,
  response,
}: {
  open: boolean;
  response: { status: number; message: string };
}) {
  return (
    <Snackbar open={open} TransitionComponent={SlideTransition}>
      <Alert
        severity={response.status === 400 ? "error" : "success"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        <Typography>{response.message}</Typography>
      </Alert>
    </Snackbar>
  );
}
