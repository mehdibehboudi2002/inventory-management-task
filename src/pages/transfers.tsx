import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import Layout from "@/components/layout/Layout";
import ListTable from "@/components/ui/ListTable";
import { DataTableColumn, Product, Warehouse, Transfer } from "@/types/inventory";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchInventoryData,
  createTransfer,
  deleteTransfer as deleteTransferRecord,
} from "../api/dataService"; 

const GREEN_MAIN = "#2e7d32";

export default function Transfers() {
  const [formData, setFormData] = useState({
    productId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    quantity: "",
    reason: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Use the service function to fetch all data
      const data = await fetchInventoryData();
      setProducts(data.products);
      setWarehouses(data.warehouses);
      setTransfers(data.transfers);
      setStock(data.stock);
    } catch (error) {
      console.error("Error loading data:", error);
      showSnackbar("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Calculate available stock when product or source warehouse changes
  useEffect(() => {
    if (formData.productId && formData.fromWarehouseId) {
      const stockItem = stock.find(
        (s) =>
          String(s.productId) === String(formData.productId) &&
          String(s.warehouseId) === String(formData.fromWarehouseId)
      );
      setAvailableStock(Number(stockItem?.quantity) || 0);
    } else {
      setAvailableStock(0);
    }
  }, [formData.productId, formData.fromWarehouseId, stock]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { [key: string]: string } = {};
    if (!formData.productId) errors.productId = "Product is required";
    if (!formData.fromWarehouseId) errors.fromWarehouseId = "Source warehouse is required";
    if (!formData.toWarehouseId) errors.toWarehouseId = "Destination warehouse is required";
    if (!formData.quantity) errors.quantity = "Quantity is required";
    if (!formData.reason) errors.reason = "Reason is required";

    const quantity = parseInt(formData.quantity);
    if (!errors.quantity && (isNaN(quantity) || quantity <= 0)) errors.quantity = "Quantity must be greater than 0";
    
    // Recalculate available stock at the moment of submission to ensure accuracy
    const stockItem = stock.find(
      (s) =>
        String(s.productId) === String(formData.productId) &&
        String(s.warehouseId) === String(formData.fromWarehouseId)
    );
    const currentAvailableStock = Number(stockItem?.quantity) || 0;

    if (!errors.quantity && quantity > currentAvailableStock)
      errors.quantity = `Insufficient stock. Only ${currentAvailableStock} units available`;
      
    if (!errors.toWarehouseId && formData.fromWarehouseId === formData.toWarehouseId)
      errors.toWarehouseId = "Source and destination must be different";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmitting(true);
      
      await createTransfer({
        productId: formData.productId,
        fromWarehouseId: formData.fromWarehouseId,
        toWarehouseId: formData.toWarehouseId,
        quantity,
        reason: formData.reason,
      });

      showSnackbar("Transfer completed successfully!", "success");
      setFormData({ productId: "", fromWarehouseId: "", toWarehouseId: "", quantity: "", reason: "" });
      setFormErrors({});
      fetchData(); 
    } catch (error: any) {
      showSnackbar(error.message || "Transfer failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete transfer handler
  const handleDelete = async (id: string) => {
    console.warn("Delete action attempted. Please implement a proper custom modal UI for confirmation instead of using window.confirm() or alert().");
    
    try {
      // Use the service function to delete the record
      await deleteTransferRecord(id);
      
      setTransfers(transfers.filter((t) => String(t.id) !== String(id)));
      showSnackbar("Transfer deleted successfully", "success");
    } catch (error: any) {
      showSnackbar(error.message || "Failed to delete transfer", "error");
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => String(p.id) === String(productId));
    return product ? `${product.name} (${product.sku})` : "Unknown";
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => String(w.id) === String(warehouseId));
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown";
  };

  const columns: DataTableColumn<Transfer>[] = [
    { id: "timestamp", label: "Date & Time", minWidth: 150, render: (row) => new Date(row.timestamp).toLocaleString() },
    { id: "productId", label: "Product", minWidth: 200, render: (row) => getProductName(row.productId) },
    { id: "fromWarehouseId", label: "From", minWidth: 150, render: (row) => getWarehouseName(row.fromWarehouseId) },
    { id: "toWarehouseId", label: "To", minWidth: 150, render: (row) => getWarehouseName(row.toWarehouseId) },
    { id: "quantity", label: "Quantity", align: "right", render: (row) => row.quantity.toLocaleString() },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row) => <Chip label={row.status} color={row.status === "Complete" ? "success" : "warning"} size="small" sx={{ fontWeight: 600 }} />,
    },
    { id: "reason", label: "Reason", minWidth: 200, render: (row) => row.reason || "-" },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (row) => (
        <IconButton color="error" onClick={() => handleDelete(row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

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
      <Container maxWidth="xl" sx={{ mt: 3, }}>
        <Typography variant="h4" gutterBottom sx={{ color: GREEN_MAIN, fontWeight: 600, mb: 3 }}>
          Stock Transfers
        </Typography>
        <Grid container spacing={3}>
          {/* Transfer Form */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, paddingBottom: "30px" , borderRadius: "20px" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <SwapHorizIcon sx={{ mr: 1, color: GREEN_MAIN }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>New Transfer</Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Product */}
                <div className="form-group">
                  <select name="productId" value={formData.productId} onChange={handleInputChange} className="form-select">
                    <option value="">Select a product</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                  </select>
                  <label className="form-label">Product *</label>
                  {formErrors.productId && <div className="helper-text error">{formErrors.productId}</div>}
                </div>

                {/* From Warehouse */}
                <div className="form-group">
                  <select name="fromWarehouseId" value={formData.fromWarehouseId} onChange={handleInputChange} className="form-select">
                    <option value="">Select an origin warehouse</option>
                    {warehouses.filter(w => String(w.id) !== String(formData.toWarehouseId)).map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                  <label className="form-label">From Warehouse *</label>
                  {formErrors.fromWarehouseId && <div className="helper-text error">{formErrors.fromWarehouseId}</div>}
                </div>

                {/* To Warehouse */}
                <div className="form-group">
                  <select name="toWarehouseId" value={formData.toWarehouseId} onChange={handleInputChange} className="form-select">
                    <option value="">Select a destination warehouse</option>
                    {warehouses.filter(w => String(w.id) !== String(formData.fromWarehouseId)).map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                  <label className="form-label">To Warehouse *</label>
                  {formErrors.toWarehouseId && <div className="helper-text error">{formErrors.toWarehouseId}</div>}
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleInputChange} className="form-input" placeholder=" " />
                  <label className="form-label">Quantity *</label>
                  {formData.fromWarehouseId && formData.productId && <div className="helper-text available">Available: {availableStock} units</div>}
                  {formErrors.quantity && <div className="helper-text error">{formErrors.quantity}</div>}
                </div>

                {/* Reason */}
                <div>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows={3} 
                    placeholder="Enter reason for transfer" 
                    style={{ resize: "vertical" }} 
                  />
                  {formErrors.reason && <div className="helper-text error">{formErrors.reason}</div>}
                </div>


                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!formData.productId || !formData.fromWarehouseId || !formData.toWarehouseId || !formData.quantity || !formData.reason}
                  startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                  sx={{ mt: 3, borderRadius: "10px" }}
                >
                  {submitting ? "Processing..." : "Transfer Stock"}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Transfers History */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ borderRadius: "20px" }}>
              <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: GREEN_MAIN }}>Transfers History</Typography>
              </Box>
              <ListTable<Transfer> data={transfers} columns={columns} loading={false} emptyMessage="No transfers have been made yet." sx={{ p: 3, pt: 0, maxHeight: "61.7vh", overflow: "auto" }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Layout>
  );
}
