import { auth, signIn } from "@/auth";
import { Box, Button, Paper, Typography } from "@mui/material";
import { redirect, RedirectType } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";

export default async function SignIn() {
  const session = await auth();
  if (session) {
    redirect("/", RedirectType.replace);
  }

  return (
    <main>
      <section className="flex h-screen w-screen justify-center items-center">
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
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
    </main>
  );
}
