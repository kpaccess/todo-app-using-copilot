"use client";

import { useState, useEffect } from "react";
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
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [task, setTask] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchTodos();
    fetchWeeklyStats();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const response = await fetch("/api/todos/weekly");
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

  const getTodayTodos = () => {
    const todayLocal = format(new Date(), "yyyy-MM-dd");

    return todos
      .filter((todo) => {
        if (!todo.date) return false;

        const isoDateStr =
          typeof todo.date === "string"
            ? todo.date.slice(0, 10)
            : format(todo.date, "yyyy-MM-dd");

        return isoDateStr === todayLocal;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getWeekTodos = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });

    return todos
      .filter((todo) => {
        const todoDate = new Date(todo.date);
        return todoDate >= weekStart && todoDate <= weekEnd;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
            />
            <ListItemText
              primary={todo.task}
              secondary={`${format(new Date(todo.date), "MMM dd, yyyy")} • ${
                todo.duration
              } minutes`}
              sx={{
                textDecoration: todo.completed ? "line-through" : "none",
                opacity: todo.completed ? 0.6 : 1,
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))
      )}
    </List>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        📝 My Todo App
      </Typography>

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
                <Typography variant="h4">{weeklyStats.notCompleted}</Typography>
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
  );
}
