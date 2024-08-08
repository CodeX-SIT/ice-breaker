import React, { useState } from "react";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import axios from "axios";
import { set } from "zod";
import { useRouter } from "next/navigation";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function GameForm({
  code,
  assignedId,
  handleSnackbar,
}: {
  code: string;
  assignedId: number;
  handleSnackbar: (open: boolean, status?: number, message?: string) => void;
}) {
  const [name, setName] = useState("");
  const [selfie, setSelfie] = useState<File>();
  const [nextAssignment, setNextAssignment] = useState(true);
  const router = useRouter();
  const handleSelfieChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelfie(event.target.files[0]);
      handleSnackbar(true, 200, "Selfie uploaded.");
      setTimeout(() => handleSnackbar(false), 1000);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (!selfie) {
      handleSnackbar(true, 400, "Selfie not uploaded.");
      setTimeout(() => handleSnackbar(false), 1000);
      return;
    }
    // TODO: Use state to show selfie error message
    // TODO: Add selfie image compression
    formData.append("selfie", selfie);
    formData.append("assignedId", assignedId.toString());

    await axios
      .post(`/api/user/game/${code}`, formData)
      .then((response) => response.data)
      .then((data) => {
        setNextAssignment(data.nextAssignment);
      })
      .catch((error) => {
        const data = error.response.data;
        if (data.code === "INVALID_NAME") {
          handleSnackbar(true, 400, "Incorrect name.");
          setTimeout(() => handleSnackbar(false), 1000);
          return;
        }
        if (data.code === "COMPLETED") {
          router.push(`/game/completed`);
          return;
        }
        console.error(error);
      });
  };
  //TODO: Upload from camera
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        margin: "auto",
        mt: 4,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button variant="contained" component="label">
        Upload Selfie
        <VisuallyHiddenInput
          type="file"
          onChange={handleSelfieChange}
          accept="image/*"
        />
      </Button>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      <Button
        onClick={(e) => axios.get(`/api/user/game/${code}/skip/${assignedId}`)}
      >
        Skip
      </Button>
    </Box>
  );
}
