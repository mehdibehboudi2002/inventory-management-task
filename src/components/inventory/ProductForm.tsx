import {
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ReactNode } from "react";

interface GenericFormProps {
  title: string;
  isEditMode: boolean;
  onGoBack: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  children: ReactNode;
}

export default function ProductForm({
  title,
  isEditMode,
  onGoBack,
  onSubmit,
  isLoading,
  children,
}: GenericFormProps) {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: "20px" }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button 
            onClick={onGoBack} 
            startIcon={<ArrowBackIcon />} 
            color="secondary" 
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
                flexGrow: 1, 
                fontWeight: 600, 
                color: '#2e7d32' 
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 2 }}>
          {/* Form Fields will be passed as children */}
          {children}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ padding: '10px 20px', borderRadius: '10px' }}
            >
              {isEditMode ? "Save Changes" : "Create New"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}