"use client";

import NavBar from "@/components/NavBar";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { set } from "zod";

export default function AdminStats({ code }: { code: string }) {
  const [stats, setStats] = React.useState<any[]>();
  useEffect(() => {
    axios.get(`/api/gamecode/${code}/stats`).then(({ data }) => {
      setStats(data);
    });
  }, [code]);
  return (
    <>
      <NavBar />
      <div style={{marginTop: "64px"}}></div>
      <Container>
        <Paper style={{ padding: "16px" }}>
          {/* <Typography variant="h4" gutterBottom>
            Ranking
            </Typography> */}
          <List>
            {stats?.map((user, index) => (
              <ListItem key={user.userId} divider>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="body1">
                    {`${index + 1}. ${user.name}`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {`${user.completedAssignments}`}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </>
  );
}
