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
} from "@mui/material";
import Layout from "@/components/layout/Layout";

export default function AddStock() {
  const [stock, setStock] = useState({
    productId: "",
    warehouseId: "",
    quantity: "",
  });
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/warehouses").then((res) => res.json()),
    ]).then(([productsData, warehousesData]) => {
      setProducts(productsData);
      setWarehouses(warehousesData);
    });
  }, []);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: parseInt(stock.productId),
        warehouseId: parseInt(stock.warehouseId),
        quantity: parseInt(stock.quantity),
      }),
    });
    if (res.ok) {
      router.push("/stock");
    }
  };

  return (
    <>
      <Layout>
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Add Stock Record
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
                select
                label="Product"
                name="productId"
                value={stock.productId}
                onChange={handleChange}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                fullWidth
                select
                label="Warehouse"
                name="warehouseId"
                value={stock.warehouseId}
                onChange={handleChange}
              >
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.code})
                  </MenuItem>
                ))}
              </TextField>
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
              />
              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Add Stock
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  href="/stock"
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
