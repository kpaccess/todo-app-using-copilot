"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Link,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { format } from "date-fns";
import { Topic, TopicNote } from "../types";

interface TopicDetailsPanelProps {
  topic: Topic | null;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onSaveNotes: (topicId: string, notes: Partial<TopicNote>) => void;
}

export default function TopicDetailsPanel({
  topic,
  onUpdateTopic,
  onSaveNotes,
}: TopicDetailsPanelProps) {
  const [tabValue, setTabValue] = useState(0);
  const [keyIdea, setKeyIdea] = useState("");
  const [example, setExample] = useState("");
  const [recallQuestion, setRecallQuestion] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editMinutes, setEditMinutes] = useState(15);
  const [editUrl, setEditUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (topic) {
      setKeyIdea(topic.note?.keyIdea || "");
      setExample(topic.note?.example || "");
      setRecallQuestion(topic.note?.recallQuestion || "");
      setEditTitle(topic.title);
      setEditMinutes(topic.targetMinutes);
      setEditUrl(topic.sourceUrl || "");
    }
  }, [topic]);

  if (!topic) {
    return (
      <Box
        sx={{
          width: 400,
          borderLeft: "1px solid",
          borderColor: "divider",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="textSecondary">
          Select a topic to view details
        </Typography>
      </Box>
    );
  }

  const handleSaveNotes = () => {
    onSaveNotes(topic.id, {
      keyIdea,
      example,
      recallQuestion,
    });
    setSnackbarMessage("Your notes have been saved");
    setSnackbarOpen(true);
  };

  const handleSaveForm = () => {
    onUpdateTopic(topic.id, {
      title: editTitle,
      targetMinutes: editMinutes,
      sourceUrl: editUrl || undefined,
    });
    setSnackbarMessage("Changes saved successfully");
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        width: 400,
        borderLeft: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {topic.title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={topic.completed ? "Completed" : "In Progress"}
            size="small"
            color={topic.completed ? "success" : "default"}
          />
          <Chip label={`${topic.targetMinutes} min`} size="small" />
          {topic.lastStudiedAt && (
            <Chip
              label={`Last: ${format(
                new Date(topic.lastStudiedAt),
                "MMM d, yyyy"
              )}`}
              size="small"
            />
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="NOTES" />
        <Tab label="FORM" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {tabValue === 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Key idea:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={keyIdea}
              onChange={(e) => setKeyIdea(e.target.value)}
              placeholder="== vs ===., string comparisons, NaN behavior"
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Example:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder={`console.log( "2" == 1);\nconsole.log( "3" == "1");\nconsole.log(NaN == NaN);\nconsole.log(NaN === NaN);`}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { fontFamily: "monospace" },
              }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Recall Question:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={recallQuestion}
              onChange={(e) => setRecallQuestion(e.target.value)}
              placeholder='What are the weird cases where " == " surprises you?'
              sx={{ mb: 2 }}
            />

            <Button variant="contained" fullWidth onClick={handleSaveNotes}>
              SAVE NOTES
            </Button>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <TextField
              fullWidth
              label="Topic Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Target Minutes"
              type="number"
              value={editMinutes}
              onChange={(e) => setEditMinutes(parseInt(e.target.value) || 15)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Source URL"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              sx={{ mb: 2 }}
            />

            {topic.sourceUrl && (
              <Box sx={{ mb: 2 }}>
                <Link href={topic.sourceUrl} target="_blank" rel="noopener">
                  Open Source Link
                </Link>
              </Box>
            )}

            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: "block", mb: 2 }}
            >
              Created: {format(new Date(topic.createdAt), "MMM d, yyyy HH:mm")}
            </Typography>

            <Button variant="contained" fullWidth onClick={handleSaveForm}>
              SAVE CHANGES
            </Button>
          </Box>
        )}
      </Box>

      {/* Snackbar Notification */}
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
    </Box>
  );
}
