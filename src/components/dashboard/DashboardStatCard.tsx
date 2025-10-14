import { Card, CardContent, Typography, Box } from "@mui/material";

export default function DashboardStatCard({
  title,
  value,
  icon,
  backgroundGradient,
}) {
  return (
    <Card
      sx={{
        // Apply the dynamic gradient background
        background: backgroundGradient,
        color: "white",
        height: "100%",
        borderRadius: "20px",
        display: 'flex',
        alignItems: 'center',
        // Subtle elevation for modern look
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
        
        {/* Icon Container: Ensures the icon styles are applied correctly */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {/* We assume the icon passed in will have responsive styles defined on it */}
          {icon}
        </Box>
        
        {/* Value: Large and bold */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
        
        {/* Title/Label: Smaller text for description */}
        <Typography
          variant="body2"
          sx={{
            opacity: 0.9,
            fontSize: { xs: "0.65rem", sm: "0.875rem", md: "1rem" },
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}