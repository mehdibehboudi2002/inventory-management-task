import { Paper, Typography } from "@mui/material";

const GREEN_MAIN = "#2e7d32";

export default function DashboardChartPanel({
  title,
  children,
  isFullWidth = false,
}) {
  return (
    <Paper
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        // Maintain 100% height for side-by-side charts, or auto for full width
        height: isFullWidth ? 'auto' : "100%", 
        borderRadius: "20px", 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: GREEN_MAIN,
          fontWeight: 600,
          fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
        }}
      >
        {title}
      </Typography>
      
      {/* The actual chart component is rendered here */}
      {children}
    </Paper>
  );
}