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
}: {
  code: string;
  assignedId: number;
}) {
  const [name, setName] = useState("");
  const [selfie, setSelfie] = useState<File>();
  const [nextAssignment, setNextAssignment] = useState(true);
  const router = useRouter();
  const handleSelfieChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelfie(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (!selfie) return; // TODO: Use state to show selfie error message

    formData.append("selfie", selfie);
    formData.append("assignedId", assignedId.toString());

    const response = await axios
      .post(`/api/user/game/${code}`, formData)
      .then((response) => response.data)
      .then((data) => {
        if (data.code === "INVALID_NAME") {
          // TODO: Use state to show name error message
          alert("Invalid name");
          return;
        }
        if (data.code === "COMPLETED") {
          router.push(`/game/completed`);
          return;
        }
        setNextAssignment(data.nextAssignment);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
    </Box>
  );
}
