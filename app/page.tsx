"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Stack,
  AppBar,
  Toolbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { format, startOfWeek, endOfWeek } from "date-fns";

interface Todo {
  id: string;
  task: string;
  date: string;
  duration: number;
  completed: boolean;
}

interface WeeklyStats {
  total: number;
  completed: number;
  notCompleted: number;
  totalDuration: number;
  weekStart: string;
  weekEnd: string;
}

export default function Home() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [task, setTask] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDuration, setEditDuration] = useState("");

  useEffect(() => {
    fetchTodos();
    fetchWeeklyStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const toLocalDate = (input: string | Date) => {
    const utcDate = typeof input === "string" ? new Date(input) : input;
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
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

  const renderTodoList = (todoList: Todo[]) => (
    <List>
      {todoList.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No tasks for this period
        </Typography>
      ) : (
        todoList.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              bgcolor: "background.paper",
              mb: 1,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id, todo.completed)}
              sx={{ mr: 1 }}
              disabled={editId === todo.id}
            />
            {editId === todo.id ? (
              <Box
                sx={{ flex: 1, display: "flex", gap: 1, alignItems: "center" }}
              >
                <TextField
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                />
                <TextField
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  size="small"
                  sx={{ minWidth: 80 }}
                  inputProps={{ min: 1 }}
                />
                <IconButton
                  aria-label="save"
                  color="primary"
                  onClick={() => handleEditSave(todo.id)}
                  disabled={loading}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton aria-label="cancel" onClick={handleEditCancel}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={todo.task}
                  secondary={`${format(
                    toLocalDate(todo.date),
                    "MMM dd, yyyy"
                  )} • ${todo.duration} minutes`}
                  sx={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    opacity: todo.completed ? 0.6 : 1,
                  }}
                />
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditClick(todo)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))
      )}
    </List>
  );

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
        {/* Add Todo Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add New Task
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What do you need to do?"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 30"
              />
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddTodo}
              disabled={loading}
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : "Add Task"}
            </Button>
          </Stack>
        </Paper>

        {/* Weekly Statistics */}
        {weeklyStats && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              📊 This Week's Progress
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {format(new Date(weeklyStats.weekStart), "MMM dd")} -{" "}
              {format(new Date(weeklyStats.weekEnd), "MMM dd, yyyy")}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 2,
                mt: 1,
              }}
            >
              <Card>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Total Tasks
                  </Typography>
                  <Typography variant="h4">{weeklyStats.total}</Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: "success.light" }}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h4">{weeklyStats.completed}</Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: "warning.light" }}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Remaining
                  </Typography>
                  <Typography variant="h4">
                    {weeklyStats.notCompleted}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: "info.light" }}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Time (min)
                  </Typography>
                  <Typography variant="h4">
                    {weeklyStats.totalDuration}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        )}

        {/* Tabs for Today and This Week */}
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
            {tabValue === 0 && renderTodoList(getTodayTodos())}
            {tabValue === 1 && renderTodoList(getWeekTodos())}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
