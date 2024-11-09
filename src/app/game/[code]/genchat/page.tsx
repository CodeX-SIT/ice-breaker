"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import ReactMarkdown from "react-markdown";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function ChatBot({ params }: { params: { code: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`/api/gamecode/${params.code}/chat`, {
        userMessage: input,
      });
      const botMessage = {
        role: "bot" as const,
        content: response.data.botMessage as string,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.error(e.toJSON());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 4,
        p: 2,
        backgroundColor: "#f3f3f3",
        borderRadius: "12px",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Game Chatbot
      </Typography>
      <Box
        sx={{
          height: "500px",
          overflowY: "auto",
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: msg.role === "user" ? "#0088cc" : "#586e75",
                ml: msg.role === "user" ? 2 : 0,
                mr: msg.role === "bot" ? 2 : 0,
                width: 32,
                height: 32,
                mt: 1,
              }}
            >
              {msg.role === "user" ? <PersonIcon /> : <SmartToyIcon />}
            </Avatar>
            <Box
              sx={{
                maxWidth: "70%",
                padding: "0.8rem 1rem",
                backgroundColor: msg.role === "user" ? "#dcf8c6" : "#e6e6e6",
                borderRadius:
                  msg.role === "user" ? "18px 18px 0 18px" : "18px 18px 18px 0",
                fontSize: "0.95rem",
              }}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <TextField
        fullWidth
        label="Type your message"
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter" && !loading) sendMessage();
        }}
        sx={{ mb: 2, backgroundColor: "#ffffff", borderRadius: "8px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={sendMessage}
        fullWidth
        disabled={loading}
        sx={{ height: "3rem", backgroundColor: "#0088cc" }}
      >
        {loading ? <CircularProgress size={24} /> : "Send"}
      </Button>
    </Box>
  );
}
