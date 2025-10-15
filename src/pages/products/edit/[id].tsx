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

// Define the shape of the product data
interface ProductForm {
  sku: string;
  name: string;
  category: string;
  unitCost: string | number;
  reorderPoint: string | number;
}

// Define the shape of validation errors
interface FormErrors {
  [key: string]: string;
}

export default function EditProduct() {
  const [product, setProduct] = useState<ProductForm>({
    sku: "",
    name: "",
    category: "",
    unitCost: "",
    reorderPoint: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  // Data Fetching 
  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch product");
          return res.json();
        })
        .then((data) => {
          // Convert numeric values back to strings for controlled form inputs
          setProduct({
            ...data,
            unitCost: data.unitCost.toString(),
            reorderPoint: data.reorderPoint.toString(),
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setLoading(false);
        });
    }
  }, [id]);

  // Validation Logic 
  const validate = (data: ProductForm) => {
    const newErrors: FormErrors = {};
    if (!data.sku.trim()) newErrors.sku = "SKU is required";
    if (!data.name.trim()) newErrors.name = "Product Name is required";
    if (!data.category.trim()) newErrors.category = "Category is required";
    if (isNaN(parseFloat(data.unitCost.toString())) || parseFloat(data.unitCost.toString()) <= 0) {
      newErrors.unitCost = "Unit Cost must be a positive number";
    }
    // Check if reorderPoint is a valid non-negative integer
    if (isNaN(parseInt(data.reorderPoint.toString())) || parseInt(data.reorderPoint.toString()) < 0) {
      newErrors.reorderPoint = "Reorder Point must be a non-negative integer";
    }
    return newErrors;
  };

  // Change Handler 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Submit Handler 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate(product);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for API
      const payload = {
        ...product,
        unitCost: parseFloat(product.unitCost.toString()),
        reorderPoint: parseInt(product.reorderPoint.toString()),
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/products");
      } else {
        // Handle API errors 
        const errorData = await res.json();
        console.error("API Error:", errorData);
        alert(`Failed to update product: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Edit Product
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            {/* SKU Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="SKU"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              error={!!errors.sku}
              helperText={errors.sku}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                },
              }}
            />
            {/* Product Name Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                },
              }}
            />
            {/* Category Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Category"
              name="category"
              value={product.category}
              onChange={handleChange}
              error={!!errors.category}
              helperText={errors.category}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                },
              }}
            />
            {/* Unit Cost Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Unit Cost"
              name="unitCost"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              value={product.unitCost}
              onChange={handleChange}
              error={!!errors.unitCost}
              helperText={errors.unitCost}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                },
              }}
            />
            {/* Reorder Point Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Reorder Point"
              name="reorderPoint"
              type="number"
              inputProps={{ min: "0" }}
              value={product.reorderPoint}
              onChange={handleChange}
              error={!!errors.reorderPoint}
              helperText={errors.reorderPoint}
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
                      {"Update Product"}
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
                href="/products"
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