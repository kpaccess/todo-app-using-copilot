"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotesIcon from "@mui/icons-material/Notes";
import LinkIcon from "@mui/icons-material/Link";
import { format } from "date-fns";
import { Topic, LearningWeeklyStats } from "../types";

interface TopicListProps {
  topics: Topic[];
  weeklyStats: LearningWeeklyStats | null;
  selectedTrackId: string | null;
  onToggleTopic: (topicId: string, completed: boolean) => void;
  onCreateTopic: (
    title: string,
    targetMinutes: number,
    sourceUrl?: string
  ) => void;
  onDeleteTopic: (topicId: string) => void;
  onSelectTopic: (topic: Topic) => void;
}

export default function TopicList({
  topics,
  weeklyStats,
  selectedTrackId,
  onToggleTopic,
  onCreateTopic,
  onDeleteTopic,
  onSelectTopic,
}: TopicListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicMinutes, setNewTopicMinutes] = useState(15);
  const [newTopicUrl, setNewTopicUrl] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = () => {
    if (newTopicTitle.trim() && selectedTrackId) {
      onCreateTopic(
        newTopicTitle.trim(),
        newTopicMinutes,
        newTopicUrl || undefined
      );
      setNewTopicTitle("");
      setNewTopicMinutes(15);
      setNewTopicUrl("");
      setCreateDialogOpen(false);
    }
  };

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "completed":
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
      case "lastStudiedAt":
        if (!a.lastStudiedAt && !b.lastStudiedAt) return 0;
        if (!a.lastStudiedAt) return 1;
        if (!b.lastStudiedAt) return -1;
        return (
          new Date(b.lastStudiedAt).getTime() -
          new Date(a.lastStudiedAt).getTime()
        );
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Weekly Stats */}
      {weeklyStats && (
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Progress
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: "#f5f5f5" }}>
                <Typography variant="h6">{weeklyStats.total}</Typography>
                <Typography variant="caption">Total Tasks</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Paper
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  bgcolor: "#4caf50",
                  color: "white",
                }}
              >
                <Typography variant="h6">{weeklyStats.completed}</Typography>
                <Typography variant="caption">Completed</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Paper
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  bgcolor: "#ff9800",
                  color: "white",
                }}
              >
                <Typography variant="h6">{weeklyStats.remaining}</Typography>
                <Typography variant="caption">Remaining</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Paper
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  bgcolor: "#2196f3",
                  color: "white",
                }}
              >
                <Typography variant="h6">{weeklyStats.timeMinutes}</Typography>
                <Typography variant="caption">Time (min)</Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      )}

      {/* Search and Sort */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search topics..."
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort by"
            >
              <SelectMenuItem value="createdAt">Created</SelectMenuItem>
              <SelectMenuItem value="title">Title</SelectMenuItem>
              <SelectMenuItem value="completed">Status</SelectMenuItem>
              <SelectMenuItem value="lastStudiedAt">
                Last Studied
              </SelectMenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          disabled={!selectedTrackId}
          size="small"
        >
          Add Topic
        </Button>
      </Box>

      {/* Topic List */}
      <List sx={{ flex: 1, overflow: "auto", py: 0 }}>
        {sortedTopics.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="textSecondary" sx={{ mb: 1 }}>
              {selectedTrackId
                ? "No topics yet"
                : "Select a track to view topics"}
            </Typography>
            {selectedTrackId && (
              <Typography variant="caption" color="textSecondary">
                Click "Add Topic" above to create your first learning topic!
              </Typography>
            )}
          </Box>
        )}
        {sortedTopics.map((topic) => (
          <ListItem
            key={topic.id}
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Checkbox
              checked={topic.completed}
              onChange={(e) => onToggleTopic(topic.id, e.target.checked)}
              sx={{ mt: 0.5 }}
            />
            <Box
              sx={{ flex: 1, cursor: "pointer" }}
              onClick={() => onSelectTopic(topic)}
            >
              <Typography
                variant="body1"
                sx={{
                  textDecoration: topic.completed ? "line-through" : "none",
                  color: topic.completed ? "text.secondary" : "text.primary",
                }}
              >
                {topic.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                <Chip label={`${topic.targetMinutes} min`} size="small" />
                {topic.lastStudiedAt && (
                  <Chip
                    label={`Studied: ${format(
                      new Date(topic.lastStudiedAt),
                      "MMM d"
                    )}`}
                    size="small"
                    color="success"
                  />
                )}
                {topic.sourceUrl && (
                  <Chip
                    label="Link"
                    size="small"
                    variant="outlined"
                    icon={<LinkIcon />}
                    component="a"
                    href={topic.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton size="small" onClick={() => onSelectTopic(topic)}>
                <NotesIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDeleteTopic(topic.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Create Topic Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Topic</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Topic Title"
            fullWidth
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Target Minutes"
            type="number"
            fullWidth
            value={newTopicMinutes}
            onChange={(e) => setNewTopicMinutes(parseInt(e.target.value) || 15)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Source URL (optional)"
            fullWidth
            value={newTopicUrl}
            onChange={(e) => setNewTopicUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
