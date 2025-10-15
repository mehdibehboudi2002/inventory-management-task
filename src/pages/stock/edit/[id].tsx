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
  MenuItem,
  CircularProgress,
  Hidden,
} from "@mui/material";
import Layout from "@/components/layout/Layout";

// Define interfaces with a consistent pattern
interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
}

interface StockForm {
  productId: string | number;
  warehouseId: string | number;
  quantity: string | number;
}
interface FormErrors {
  [key: string]: string;
}

export default function EditStock() {
  const [stock, setStock] = useState<StockForm>({
    productId: "",
    warehouseId: "",
    quantity: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  // Data Fetching 
  useEffect(() => {
    if (id) {
      Promise.all([
        fetch(`/api/stock/${id}`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch stock record");
          return res.json();
        }),
        fetch("/api/products").then((res) => res.json()),
        fetch("/api/warehouses").then((res) => res.json()),
      ]).then(([stockData, productsData, warehousesData]) => {
        setProducts(productsData);
        setWarehouses(warehousesData);
        // Convert numbers from API to strings for form
        setStock({
          productId: stockData.productId.toString(),
          warehouseId: stockData.warehouseId.toString(),
          quantity: stockData.quantity.toString(),
        });
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
    }
  }, [id]);

  // Validation Logic
  const validate = (data: StockForm) => {
    const newErrors: FormErrors = {};
    if (!data.productId) newErrors.productId = "Product selection is required";
    if (!data.warehouseId) newErrors.warehouseId = "Warehouse selection is required";
    // Check if quantity is a valid non-negative integer
    const quantity = parseInt(data.quantity.toString());
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = "Quantity must be a non-negative integer";
    }
    return newErrors;
  };

  // Change Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStock((prevStock) => ({ ...prevStock, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate(stock);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for API 
      const payload = {
        productId: parseInt(stock.productId.toString()),
        warehouseId: parseInt(stock.warehouseId.toString()),
        quantity: parseInt(stock.quantity.toString()),
      };

      const res = await fetch(`/api/stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/stock");
      } else {
        const errorData = await res.json();
        alert(`Failed to update stock: ${errorData.message || res.statusText}`);
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
            Edit Stock Record
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            {/* Product Select Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Product"
              name="productId"
              value={stock.productId}
              onChange={handleChange}
              error={!!errors.productId}
              helperText={errors.productId}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                },
              }}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </MenuItem>
              ))}
            </TextField>
            {/* Warehouse Select Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Warehouse"
              name="warehouseId"
              value={stock.warehouseId}
              onChange={handleChange}
              error={!!errors.warehouseId}
              helperText={errors.warehouseId}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                },
              }}
            >
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.code})
                </MenuItem>
              ))}
            </TextField>
            {/* Quantity Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              inputProps={{ min: "0" }}
              value={stock.quantity}
              onChange={handleChange}
              error={!!errors.quantity}
              helperText={errors.quantity}
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
                      {"Update Stock"}
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
                href="/stock"
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