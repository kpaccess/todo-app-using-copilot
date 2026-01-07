"use client";

import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Track } from "../types";

interface TrackSidebarProps {
  tracks: Track[];
  selectedTrack: Track | null;
  onSelectTrack: (track: Track) => void;
  onCreateTrack: (name: string) => void;
  onRenameTrack: (trackId: string, newName: string) => void;
  onDeleteTrack: (trackId: string) => void;
}

export default function TrackSidebar({
  tracks,
  selectedTrack,
  onSelectTrack,
  onCreateTrack,
  onRenameTrack,
  onDeleteTrack,
}: TrackSidebarProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newTrackName, setNewTrackName] = useState("");
  const [renameTrackName, setRenameTrackName] = useState("");
  const [selectedForAction, setSelectedForAction] = useState<Track | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    track: Track
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedForAction(track);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = () => {
    if (newTrackName.trim()) {
      onCreateTrack(newTrackName.trim());
      setNewTrackName("");
      setCreateDialogOpen(false);
    }
  };

  const handleRenameClick = () => {
    if (selectedForAction) {
      setRenameTrackName(selectedForAction.name);
      setRenameDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleRenameSubmit = () => {
    if (selectedForAction && renameTrackName.trim()) {
      onRenameTrack(selectedForAction.id, renameTrackName.trim());
      setRenameTrackName("");
      setRenameDialogOpen(false);
      setSelectedForAction(null);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (selectedForAction) {
      onDeleteTrack(selectedForAction.id);
      setDeleteDialogOpen(false);
      setSelectedForAction(null);
    }
  };

  return (
    <Box
      sx={{
        width: 280,
        borderRight: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Tracks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          onClick={handleCreateClick}
          size="small"
        >
          New Track
        </Button>
      </Box>

      <List sx={{ flex: 1, overflow: "auto", py: 0 }}>
        {tracks.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              No tracks yet
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Click "New Track" above to create your first learning track!
            </Typography>
          </Box>
        )}
        {tracks.map((track) => (
          <ListItem
            key={track.id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => handleMenuOpen(e, track)}
              >
                <MoreVertIcon />
              </IconButton>
            }
          >
            <ListItemButton
              selected={selectedTrack?.id === track.id}
              onClick={() => onSelectTrack(track)}
            >
              <ListItemText
                primary={track.name}
                secondary={`${track.completedTopics}/${track.totalTopics}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Create Track Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Track</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Track Name"
            fullWidth
            value={newTrackName}
            onChange={(e) => setNewTrackName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCreateSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Track Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rename Track</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Track Name"
            fullWidth
            value={renameTrackName}
            onChange={(e) => setRenameTrackName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleRenameSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Track Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Track</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{selectedForAction?.name}
            &quot;? This will also delete all topics within this track.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRenameClick}>Rename</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}
