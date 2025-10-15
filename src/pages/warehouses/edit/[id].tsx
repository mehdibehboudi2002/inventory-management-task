import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Hidden,
} from "@mui/material";
import Layout from "@/components/layout/Layout";

// Define the shape of the warehouse data
interface WarehouseForm {
  name: string;
  location: string;
  code: string;
}
interface FormErrors {
  [key: string]: string;
}

export default function EditWarehouse() {
  const [warehouse, setWarehouse] = useState<WarehouseForm>({
    name: "",
    location: "",
    code: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  // Data Fetching
  useEffect(() => {
    if (id) {
      fetch(`/api/warehouses/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch warehouse");
          return res.json();
        })
        .then((data) => {
          setWarehouse(data);
          setLoading(false);
        }).catch((error) => {
          console.error("Error fetching warehouse:", error);
          setLoading(false);
        });
    }
  }, [id]);

  // Validation Logic
  const validate = (data: WarehouseForm) => {
    const newErrors: FormErrors = {};
    if (!data.code.trim()) newErrors.code = "Warehouse Code is required";
    if (!data.name.trim()) newErrors.name = "Warehouse Name is required";
    if (!data.location.trim()) newErrors.location = "Location is required";
    return newErrors;
  };

  // Change Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWarehouse((prevWarehouse) => ({ ...prevWarehouse, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate(warehouse);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/warehouses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouse),
      });

      if (res.ok) {
        router.push("/warehouses");
      } else {
        const errorData = await res.json();
        alert(`Failed to update warehouse: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State UI
  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mb: { xs: 1, md: 0 }, mt: { xs: 2, md: 6 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
          <Typography variant="h4" component="h1" gutterBottom
            sx={{
              fontSize: {
                xs: '1.4rem',
                md: '2.125rem'
              }
            }}
          >
            Edit Warehouse
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            {/* Warehouse Code Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Warehouse Code"
              name="code"
              value={warehouse.code}
              onChange={handleChange}
              error={!!errors.code}
              helperText={errors.code}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                },
              }}
            />
            {/* Warehouse Name Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Warehouse Name"
              name="name"
              value={warehouse.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                },
              }}
            />
            {/* Location Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Location"
              name="location"
              value={warehouse.location}
              onChange={handleChange}
              error={!!errors.location}
              helperText={errors.location}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                },
              }}
            />
            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                sx={{ borderRadius: "12px" }}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (
                  <>
                    <Hidden implementation="css" mdDown>
                      {"Update Warehouse"}
                    </Hidden>
                    <Hidden implementation="css" mdUp>
                      {"Update"}
                    </Hidden>
                  </>
                )}
              </Button>
              <Button
                sx={{ borderRadius: "12px" }}
                fullWidth
                variant="outlined"
                component={Link}
                href="/warehouses"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}