import React from "react";
import { Alert, Snackbar, Typography } from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";
import type { HobbySubmitReturnType } from "@/actions/hobbySubmit";
import { redirect } from "next/navigation";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export default function InvalidHobbies({
  open,
  hobbySubmitResponse,
}: {
  open: boolean;
  hobbySubmitResponse: HobbySubmitReturnType;
}) {
  return (
    <Snackbar open={open} TransitionComponent={SlideTransition}>
      <Alert
        severity={hobbySubmitResponse.error ? "error" : "success"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        <Typography>
          {hobbySubmitResponse.success
            ? "Hobbies saved!"
            : hobbySubmitResponse.error}
        </Typography>
      </Alert>
    </Snackbar>
  );
}
