import { auth, signOut } from "@/auth";
import { Box, Button, Paper, Typography } from "@mui/material";
import { redirect, RedirectType } from "next/navigation";

export default async function SignOut() {
  const session = await auth();
  if (!session) {
    redirect("/", RedirectType.replace);
  }
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
