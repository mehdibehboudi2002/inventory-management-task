import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ReactNode } from "react";

interface InventoryListHeaderProps {
  title: string;
  actionButtonText: string;
  actionHref: string;
  CustomLinkComponent: React.ComponentType<{ href: string; children: ReactNode }>;
}

export default function InventoryListHeader({
  title,
  actionButtonText,
  actionHref,
  CustomLinkComponent,
}: InventoryListHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3, // Padding inside the header, assumes parent is a Paper/Card
        borderBottom: "1px solid #eee",
        mb: 2, // Margin below the header to separate from the table
      }}
    >
      <Typography 
        variant="h5" 
        component="h2"
        sx={{
          fontWeight: 600,
          color: '#2e7d32', // Use the theme color for consistency
        }}
      >
        {title}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        component={CustomLinkComponent}
        href={actionHref}
        sx={{
            borderRadius: '10px',
            minWidth: { xs: 'auto', sm: 150 },
            padding: { xs: '8px 12px', sm: '8px 16px' },
        }}
      >
        {actionButtonText}
      </Button>
    </Box>
  );
}