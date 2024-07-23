import { useFormState } from "react-dom";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NavBar from "@/components/NavBar";
import createUser from "@/actions/createUser";
import { UserCreateResponse } from "@/actions/UserCreateResponse";
import InvalidRegister from "@/components/Snackbars/InvalidRegister";
import { redirect, useRouter } from "next/navigation";

const initialState: UserCreateResponse = {
  status: 0,
  body: {
    message: "",
    errors: [],
  },
};

export default function RegisterPage() {
  const [state, formAction] = useFormState(createUser, initialState);

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
              Sign up
            </Typography>
            <form
              className="m-4 flex flex-col items-center"
              action={formAction}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    autoFocus
                    color="primary"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "50%" }}
              >
                <Typography>Login</Typography>
              </Button>
            </form>
          </Paper>
        </Box>
      </section>
    </main>
  );
}
