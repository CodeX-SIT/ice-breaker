import React from "react";
import { Alert, Snackbar, Typography } from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";
import { redirect } from "next/navigation";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export default function ErrorSuccessSnackbar({
  open,
  response,
}: {
  open: boolean;
  response: { status: number; message: string };
}) {
  return (
    <Snackbar open={open} TransitionComponent={SlideTransition}>
      <Alert
        severity={(() => {
          if (String(response.status).startsWith("2")) {
            return "success";
          } else if (
            String(response.status).startsWith("4") ||
            String(response.status).startsWith("5")
          ) {
            return "error";
          } else if (String(response.status).startsWith("10")) {
            return "warning";
          }
        })()}
        variant="filled"
        sx={{ width: "100%" }}
      >
        <Typography>{response.message}</Typography>
      </Alert>
    </Snackbar>
  );
}
