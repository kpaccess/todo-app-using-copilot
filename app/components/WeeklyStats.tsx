import { Paper, Typography, Box, Card, CardContent } from "@mui/material";
import { format } from "date-fns";
import type { WeeklyStats } from "../../app/types";

export default function WeeklyStats({
  total,
  completed,
  notCompleted,
  totalDuration,
  weekStart,
  weekEnd,
}: WeeklyStats) {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        📊 This Week&apos;s Progress
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {format(new Date(weekStart), "MMM dd")} -{" "}
        {format(new Date(weekEnd), "MMM dd, yyyy")}
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
            <Typography variant="h4">{total}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "success.light" }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Completed
            </Typography>
            <Typography variant="h4">{completed}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "warning.light" }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Remaining
            </Typography>
            <Typography variant="h4">{notCompleted}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "info.light" }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Time (min)
            </Typography>
            <Typography variant="h4">{totalDuration}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Paper>
  );
}
