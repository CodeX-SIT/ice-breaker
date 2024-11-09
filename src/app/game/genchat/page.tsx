"use client";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
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
      const response = await axios.post("/api/chat", { userMessage: input });
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
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h5">Game Chatbot</Typography>
        <div
          style={{
            height: "300px",
            overflowY: "auto",
            marginBottom: "1rem",
            padding: "0.5rem",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{ textAlign: msg.role === "user" ? "right" : "left" }}
            >
              <div>
                <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <TextField
          fullWidth
          label="Type your message"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter" && !loading) sendMessage();
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Send"}
        </Button>
      </CardContent>
    </Card>
  );
}
