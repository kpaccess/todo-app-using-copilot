import { List, ListItem, Checkbox, ListItemText, IconButton, Box, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import { Todo } from "../../app/types";
import { toLocalDate } from "../../app/utils";
import Typography from "@mui/material/Typography";

interface TodoListProps {
  todos: Todo[];
  editId: string | null;
  editTask: string;
  editDate: string;
  editDuration: string;
  loading: boolean;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEditClick: (todo: Todo) => void;
  onEditCancel: () => void;
  onEditSave: (id: string) => void;
  onEditTaskChange: (v: string) => void;
  onEditDateChange: (v: string) => void;
  onEditDurationChange: (v: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({
  todos,
  editId,
  editTask,
  editDate,
  editDuration,
  loading,
  onToggleComplete,
  onEditClick,
  onEditCancel,
  onEditSave,
  onEditTaskChange,
  onEditDateChange,
  onEditDurationChange,
  onDelete,
}: TodoListProps) {
  return (
    <List>
      {todos.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No tasks for this period
        </Typography>
      ) : (
        todos.map((todo) => (
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
              onChange={() => onToggleComplete(todo.id, todo.completed)}
              sx={{ mr: 1 }}
              disabled={editId === todo.id}
            />
            {editId === todo.id ? (
              <Box sx={{ flex: 1, display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  value={editTask}
                  onChange={(e) => onEditTaskChange(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                />
                <TextField
                  type="date"
                  value={editDate}
                  onChange={(e) => onEditDateChange(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="number"
                  value={editDuration}
                  onChange={(e) => onEditDurationChange(e.target.value)}
                  size="small"
                  sx={{ minWidth: 80 }}
                  inputProps={{ min: 1 }}
                />
                <IconButton
                  aria-label="save"
                  color="primary"
                  onClick={() => onEditSave(todo.id)}
                  disabled={loading}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton aria-label="cancel" onClick={onEditCancel}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={todo.task}
                  secondary={`${format(toLocalDate(todo.date), "MMM dd, yyyy")} • ${todo.duration} minutes`}
                  sx={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    opacity: todo.completed ? 0.6 : 1,
                  }}
                />
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEditClick(todo)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(todo.id)}
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
}
