import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import Layout from "@/components/layout/Layout";

export default function AddWarehouse() {
  const [warehouse, setWarehouse] = useState({
    name: "",
    location: "",
    code: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setWarehouse({ ...warehouse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/warehouses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(warehouse),
    });
    if (res.ok) {
      router.push("/warehouses");
    }
  };

  return (
    <>
      <Layout>
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Add New Warehouse
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="Warehouse Code"
                name="code"
                value={warehouse.code}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Warehouse Name"
                name="name"
                value={warehouse.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Location"
                name="location"
                value={warehouse.location}
                onChange={handleChange}
              />
              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Add Warehouse
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  href="/warehouses"
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Layout>
    </>
  );
}
