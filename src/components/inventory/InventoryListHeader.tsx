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
  const shortText = "Add";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        borderBottom: "1px solid #eee",
        mb: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontSize: {
            xs: '1.2rem',
            md: '2.125rem'
          },
          fontWeight: 600,
          color: '#2e7d32',
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
          whiteSpace: 'nowrap',
        }}
      >
        <Typography
          component="span"
          sx={{ display: { xs: 'none', md: 'inline' } }}
        >
          {actionButtonText}
        </Typography>
        <Typography
          component="span"
          sx={{ display: { xs: 'inline', md: 'none' } }}
        >
          {shortText}
        </Typography>
      </Button>
    </Box>
  );
}