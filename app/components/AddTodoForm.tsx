import { Box, Paper, Typography, Stack, TextField, Button, CircularProgress } from "@mui/material";

interface AddTodoFormProps {
  task: string;
  date: string;
  duration: string;
  loading: boolean;
  onTaskChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onDurationChange: (v: string) => void;
  onAdd: () => void;
}

export default function AddTodoForm({
  task,
  date,
  duration,
  loading,
  onTaskChange,
  onDateChange,
  onDurationChange,
  onAdd,
}: AddTodoFormProps) {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add New Task
      </Typography>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Task"
          value={task}
          onChange={(e) => onTaskChange(e.target.value)}
          placeholder="What do you need to do?"
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="number"
            label="Duration (minutes)"
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            placeholder="e.g., 30"
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onAdd}
          disabled={loading}
          size="large"
        >
          {loading ? <CircularProgress size={24} /> : "Add Task"}
        </Button>
      </Stack>
    </Paper>
  );
}
