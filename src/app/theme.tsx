"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "hsl(46, 82%, 70%)",
    },
    secondary: {
      main: "hsl(226, 62%, 60%)",
    },
    error: {
      main: "hsl(0, 60%, 50%)",
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
