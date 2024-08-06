"use client";

import { Box, Button, Paper, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import signInAction from "./signInAction";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";

export default function SignInPage() {
  const [open, setOpen] = useState(false);
  const error = useSearchParams().get("error");
  useEffect(() => {
    if (error === "invalid_email") {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, [error]);
  return (
    <main>
      <section className="flex h-screen w-screen justify-center items-center">
        <form action={signInAction}>
          <Box>
            <Paper>
              <GoogleIcon sx={{ m: 2, mr: 0 }} />
              <Button type="submit" variant="contained" sx={{ m: 2 }}>
                <Typography>Signin with Google</Typography>
              </Button>
            </Paper>
          </Box>
        </form>
      </section>
      <ErrorSuccessSnackbar
        open={open}
        response={{
          message: "Please use SIT Pune Gmails to signin",
          status: 403,
        }}
      />
    </main>
  );
}
