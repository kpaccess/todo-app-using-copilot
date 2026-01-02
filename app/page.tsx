"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Button,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { format, startOfWeek, endOfWeek } from "date-fns";
import TodoList from "./components/TodoList";
import AddTodoForm from "./components/AddTodoForm";
import WeeklyStats from "./components/WeeklyStats";
import { Todo, WeeklyStats as WeeklyStatsType } from "./types";
import { toLocalDate } from "./utils";

export default function Home() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStatsType | null>(null);
  const [task, setTask] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    fetchTodos();
    fetchWeeklyStats();
    fetchUserCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await fetch("/api/users/count");
      const data = await response.json();
      setUserCount(data.count);
    } catch (error) {
      setUserCount(null);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const response = await fetch("/api/todos/weekly");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      setWeeklyStats(data);
    } catch (error) {
      console.error("Failed to fetch weekly stats:", error);
    }
  };

  const handleAddTodo = async () => {
    if (!task || !date || !duration) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task,
          date,
          duration: parseInt(duration),
        }),
      });

      if (response.ok) {
        setTask("");
        setDuration("");
        setDate(format(new Date(), "yyyy-MM-dd"));
        fetchTodos();
        fetchWeeklyStats();
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTodos();
      fetchWeeklyStats();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      fetchTodos();
      fetchWeeklyStats();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const getTodayTodos = () => {
    const todayLocal = format(new Date(), "yyyy-MM-dd");

    return todos
      .filter((todo) => {
        if (!todo.date) return false;

        const localDateStr = format(toLocalDate(todo.date), "yyyy-MM-dd");
        return localDateStr === todayLocal;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getWeekTodos = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });

    return todos
      .filter((todo) => {
        const todoDate = toLocalDate(todo.date);
        return todoDate >= weekStart && todoDate <= weekEnd;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handleEditClick = (todo: Todo) => {
    setEditId(todo.id);
    setEditTask(todo.task);
    setEditDate(format(toLocalDate(todo.date), "yyyy-MM-dd"));
    setEditDuration(todo.duration.toString());
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTask("");
    setEditDate("");
    setEditDuration("");
  };

  const handleEditSave = async (id: string) => {
    if (!editTask || !editDate || !editDuration) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: editTask,
          date: editDate,
          duration: parseInt(editDuration),
        }),
      });
      if (response.ok) {
        handleEditCancel();
        fetchTodos();
        fetchWeeklyStats();
      }
    } catch (error) {
      console.error("Failed to edit todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...
  console.log("User Count:", userCount);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📝 My Todo App
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <AddTodoForm
          task={task}
          date={date}
          duration={duration}
          loading={loading}
          onTaskChange={setTask}
          onDateChange={setDate}
          onDurationChange={setDuration}
          onAdd={handleAddTodo}
        />

        {weeklyStats && <WeeklyStats stats={weeklyStats} />}

        <Paper elevation={3}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab label={`Today's Tasks (${getTodayTodos().length})`} />
            <Tab label={`This Week (${getWeekTodos().length})`} />
          </Tabs>
          <Box sx={{ p: 2 }}>
            {tabValue === 0 && (
              <TodoList
                todos={getTodayTodos()}
                editId={editId}
                editTask={editTask}
                editDate={editDate}
                editDuration={editDuration}
                loading={loading}
                onToggleComplete={handleToggleComplete}
                onEditClick={handleEditClick}
                onEditCancel={handleEditCancel}
                onEditSave={handleEditSave}
                onEditTaskChange={setEditTask}
                onEditDateChange={setEditDate}
                onEditDurationChange={setEditDuration}
                onDelete={handleDeleteTodo}
              />
            )}
            {tabValue === 1 && (
              <TodoList
                todos={getWeekTodos()}
                editId={editId}
                editTask={editTask}
                editDate={editDate}
                editDuration={editDuration}
                loading={loading}
                onToggleComplete={handleToggleComplete}
                onEditClick={handleEditClick}
                onEditCancel={handleEditCancel}
                onEditSave={handleEditSave}
                onEditTaskChange={setEditTask}
                onEditDateChange={setEditDate}
                onEditDurationChange={setEditDuration}
                onDelete={handleDeleteTodo}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
