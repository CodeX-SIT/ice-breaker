import React from "react";
import { Card, CardContent, Typography, Divider } from "@mui/material";

export interface AboutUserProps {
  hobbies: string;
  guiltyPleasures: string;
  favoriteMovies: string;
  favoriteSongs: string;
  homeTown: string;
}

export default function Hobby({ aboutUser }: { aboutUser: AboutUserProps }) {
  const { hobbies, guiltyPleasures, favoriteMovies, favoriteSongs, homeTown } =
    aboutUser;

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Home Town
        </Typography>
        <Typography variant="body1" paragraph>
          {homeTown}
        </Typography>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Hobbies
        </Typography>
        <Typography variant="body1" paragraph>
          {hobbies}
        </Typography>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Guilty Pleasures
        </Typography>
        <Typography variant="body1" paragraph>
          {guiltyPleasures}
        </Typography>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Favorite Movies
        </Typography>
        <Typography variant="body1" paragraph>
          {favoriteMovies}
        </Typography>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Favorite Songs
        </Typography>
        <Typography variant="body1" paragraph>
          {favoriteSongs}
        </Typography>
      </CardContent>
    </Card>
  );
}
