"use server";

import { auth, signOut } from "@/auth";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { Box, Button, Paper, Typography } from "@mui/material";
import { redirect, RedirectType } from "next/navigation";

export default async function SignOut() {
  await checkAuthAndRedirect();
  return (
    <main>
      <section className="flex h-screen w-screen justify-center items-center">
        <form
          action={async () => {
            "use server";
            await signOut({ redirect: true, redirectTo: "/" });
          }}
        >
          <Box>
            <Paper>
              <Button type="submit" variant="contained" sx={{ m: 2 }}>
                <Typography>Signout</Typography>
              </Button>
            </Paper>
          </Box>
        </form>
      </section>
    </main>
  );
}
