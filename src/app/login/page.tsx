import { useFormState } from "react-dom";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Link,
} from "@mui/material";
import NextLink from "next/link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NavBar from "@/components/NavBar";
import loginUser from "@/actions/loginUser";
import { useRouter } from "next/navigation";
import { UserLoginResponse } from "@/actions/UserLoginResponse";

const initialState: UserLoginResponse = {
  status: 0,
  body: {
    message: "",
    errors: [],
    token: "",
  },
};

export default function RegisterPage() {
  const [state, formAction] = useFormState(loginUser, initialState);

  const router = useRouter();

  return (
    <main>
      <NavBar />
      <section className="flex h-screen w-screen justify-center items-center">
        <Box
          sx={{
            marginTop: 8,
            width: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <form
              className="m-4 flex flex-col items-center"
              action={formAction}
            >
              <Grid container spacing={2}>
                <Grid item xl={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    color="primary"
                  />
                </Grid>
                <Grid item xl={12}>
                  <TextField
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    autoComplete="password"
                    color="primary"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xl={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    <Typography>Login</Typography>
                  </Button>
                </Grid>
                <Grid item xl={6}>
                  <Link component={NextLink} href={"/register"}>
                    Create Account
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </section>
    </main>
  );
}
