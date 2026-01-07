"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { startOfWeek, endOfWeek, format } from "date-fns";
import TrackSidebar from "../components/TrackSidebar";
import LearningTopicList from "../components/LearningTopicList";
import TopicDetailsPanel from "../components/TopicDetailsPanel";
import { Track, Topic, LearningWeeklyStats, TopicNote } from "../types";

export default function LearningTracker() {
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<LearningWeeklyStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTrack) {
      fetchTopics(selectedTrack.id);
      fetchWeeklyStats(selectedTrack.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack]);

  const initializeData = async () => {
    try {
      // Fetch tracks
      const tracksRes = await fetch("/api/tracks");
      console.log("🚀 ~ initializeData ~ fetch:", fetch);
      if (tracksRes.status === 401) {
        router.push("/login");
        return;
      }
      const tracksData = await tracksRes.json();

      // Set tracks (no automatic seeding - users create their own)
      setTracks(tracksData);
      if (tracksData.length > 0) {
        setSelectedTrack(tracksData[0]);
      }
    } catch (error) {
      console.error("Failed to initialize:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (trackId: string) => {
    try {
      const response = await fetch(`/api/topics?trackId=${trackId}`);
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  const fetchWeeklyStats = async (trackId: string) => {
    try {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });
      const response = await fetch(
        `/api/stats/weekly?trackId=${trackId}&weekStart=${format(
          weekStart,
          "yyyy-MM-dd"
        )}&weekEnd=${format(weekEnd, "yyyy-MM-dd")}`
      );
      const data = await response.json();
      setWeeklyStats(data);
    } catch (error) {
      console.error("Failed to fetch weekly stats:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCreateTrack = async (name: string) => {
    try {
      const response = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const newTrack = await response.json();
      setTracks([...tracks, newTrack]);
      setSelectedTrack(newTrack);
    } catch (error) {
      console.error("Failed to create track:", error);
    }
  };

  const handleRenameTrack = async (trackId: string, newName: string) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const updatedTrack = await response.json();
      setTracks(
        tracks.map((t) => (t.id === trackId ? { ...t, name: newName } : t))
      );
      if (selectedTrack?.id === trackId) {
        setSelectedTrack({ ...selectedTrack, name: newName });
      }
    } catch (error) {
      console.error("Failed to rename track:", error);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      await fetch(`/api/tracks/${trackId}`, { method: "DELETE" });
      const newTracks = tracks.filter((t) => t.id !== trackId);
      setTracks(newTracks);
      if (selectedTrack?.id === trackId) {
        setSelectedTrack(newTracks[0] || null);
      }
    } catch (error) {
      console.error("Failed to delete track:", error);
    }
  };

  const handleCreateTopic = async (
    title: string,
    targetMinutes: number,
    sourceUrl?: string
  ) => {
    if (!selectedTrack) return;
    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          targetMinutes,
          sourceUrl,
          trackId: selectedTrack.id,
        }),
      });
      const newTopic = await response.json();
      setTopics([...topics, newTopic]);
      // Refresh track counts
      const tracksRes = await fetch("/api/tracks");
      const tracksData = await tracksRes.json();
      setTracks(tracksData);
    } catch (error) {
      console.error("Failed to create topic:", error);
    }
  };

  const handleToggleTopic = async (topicId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      const updatedTopic = await response.json();
      setTopics(topics.map((t) => (t.id === topicId ? updatedTopic : t)));
      if (selectedTopic?.id === topicId) {
        setSelectedTopic(updatedTopic);
      }
      // Refresh stats and track counts
      if (selectedTrack) {
        fetchWeeklyStats(selectedTrack.id);
        const tracksRes = await fetch("/api/tracks");
        const tracksData = await tracksRes.json();
        setTracks(tracksData);
      }
    } catch (error) {
      console.error("Failed to toggle topic:", error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      await fetch(`/api/topics/${topicId}`, { method: "DELETE" });
      setTopics(topics.filter((t) => t.id !== topicId));
      if (selectedTopic?.id === topicId) {
        setSelectedTopic(null);
      }
      // Refresh track counts
      const tracksRes = await fetch("/api/tracks");
      const tracksData = await tracksRes.json();
      setTracks(tracksData);
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
  };

  const handleUpdateTopic = async (
    topicId: string,
    updates: Partial<Topic>
  ) => {
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const updatedTopic = await response.json();
      setTopics(topics.map((t) => (t.id === topicId ? updatedTopic : t)));
      setSelectedTopic(updatedTopic);
    } catch (error) {
      console.error("Failed to update topic:", error);
    }
  };

  const handleSaveNotes = async (
    topicId: string,
    notes: Partial<TopicNote>
  ) => {
    try {
      const response = await fetch(`/api/topics/${topicId}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notes),
      });
      const savedNote = await response.json();
      setTopics(
        topics.map((t) => (t.id === topicId ? { ...t, note: savedNote } : t))
      );
      if (selectedTopic?.id === topicId) {
        setSelectedTopic({ ...selectedTopic, note: savedNote });
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            My Learning Tracker
          </Typography>
          <Button color="inherit" onClick={() => router.push("/")}>
            HOME
          </Button>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main 3-Column Layout */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <TrackSidebar
          tracks={tracks}
          selectedTrack={selectedTrack}
          onSelectTrack={setSelectedTrack}
          onCreateTrack={handleCreateTrack}
          onRenameTrack={handleRenameTrack}
          onDeleteTrack={handleDeleteTrack}
        />
        <LearningTopicList
          topics={topics}
          weeklyStats={weeklyStats}
          selectedTrackId={selectedTrack?.id || null}
          onToggleTopic={handleToggleTopic}
          onCreateTopic={handleCreateTopic}
          onDeleteTopic={handleDeleteTopic}
          onSelectTopic={setSelectedTopic}
        />
        <TopicDetailsPanel
          topic={selectedTopic}
          onUpdateTopic={handleUpdateTopic}
          onSaveNotes={handleSaveNotes}
        />
      </Box>
    </Box>
  );
}
