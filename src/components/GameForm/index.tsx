import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

export default function GameForm({ code }: { code: string }) {
  const [name, setName] = useState('');
  const [selfie, setSelfie] = useState<File | null>(null);

  const handleSelfieChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelfie(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (selfie) {
      formData.append('selfie', selfie);
    }

    try {
      const response = await axios.post(`/api/user/game/${code}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, margin: 'auto', mt: 4, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Join Game
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button
        variant="contained"
        component="label"
      >
        Upload Selfie
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleSelfieChange}
        />
      </Button>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
