"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

interface PredefinedTopic {
  id: string;
  title: string;
  description: string | null;
}

interface PredefinedTopicsDialogProps {
  open: boolean;
  onClose: () => void;
  onTopicAdded?: () => void;
}

export default function PredefinedTopicsDialog({
  open,
  onClose,
  onTopicAdded,
}: PredefinedTopicsDialogProps) {
  const [topics, setTopics] = useState<PredefinedTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (open) {
      fetchTopics();
    }
  }, [open]);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/predefined-topics");
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error("Failed to fetch predefined topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async (topicId: string, topicTitle: string) => {
    setAdding(topicId);
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: topicTitle,
          date: new Date().toISOString().split("T")[0],
          duration: 30, // Default 30 minutes
        }),
      });

      if (response.ok) {
        setSnackbarMessage(`"${topicTitle}" added to your todo list!`);
        setSnackbarOpen(true);
        onTopicAdded?.();
      } else {
        setSnackbarMessage("Failed to add topic");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Failed to add topic:", error);
      setSnackbarMessage("Failed to add topic");
      setSnackbarOpen(true);
    } finally {
      setAdding(null);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Browse Learning Topics</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : topics.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="textSecondary">
                No predefined topics available. Run the seed script to add some.
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {topics.map((topic) => (
                <ListItem
                  key={topic.id}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleAddTopic(topic.id, topic.title)}
                      disabled={adding === topic.id}
                    >
                      {adding === topic.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <AddIcon />
                      )}
                    </IconButton>
                  }
                >
                  <ListItemButton>
                    <ListItemText
                      primary={topic.title}
                      secondary={topic.description || "No description"}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
