import React, { useState } from "react";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import axios from "axios";
import { set } from "zod";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";

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
  const router = useRouter();
  const handleSelfieChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      handleSnackbar(true, 1000, "Compressing...");
      const compressedSelfie = await compressImage(image);
      handleSnackbar(false);
      setSelfie(compressedSelfie);
      // Commented as it now required, there is already a notification when it is compressing.
      // handleSnackbar(true, 200, "Selfie uploaded.");
      // setTimeout(() => handleSnackbar(false), 1000);
    }
  };

  const compressImage = async (image: File) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    try {
      const compressedImage = await imageCompression(image, options);
      return compressedImage;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    handleSnackbar(true, 1000, "Submitting...");
    const formData = new FormData();
    formData.append("name", name);
    if (!selfie) {
      handleSnackbar(true, 400, "Selfie not uploaded.");
      setTimeout(() => handleSnackbar(false), 1000);
      return;
    }

    formData.append("selfie", selfie as Blob);
    formData.append("assignedId", assignedId.toString());

    await axios
      .post(`/api/user/game/${code}`, formData)
      .then(() => {
        handleSnackbar(true, 200, "Submitted.");
        setTimeout(() => handleSnackbar(false), 1000);
        setName("");
        setSelfie(undefined);
      })
      .catch((error) => {
        const data = error.response.data;
        if (data.code === "INVALID_NAME") {
          handleSnackbar(true, 400, "Incorrect name.");
          setTimeout(() => handleSnackbar(false), 1000);
          return;
        } else {
          handleSnackbar(true, 500, data?.code);
          setTimeout(() => handleSnackbar(false), 1000);
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
      {selfie && <Typography>{selfie.name}</Typography>}
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
