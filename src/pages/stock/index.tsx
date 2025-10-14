import { useState, useEffect, ReactNode } from "react";
import {
  Container,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper, 
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Layout from "@/components/layout/Layout"; 
import ListTable from "@/components/ui/ListTable"; 
import { DataTableColumn } from "@/types/inventory";
import InventoryListHeader from "@/components/inventory/InventoryListHeader"; 

// Mock implementation of Link behavior for the environment
const CustomLink = ({ href, children, ...props }: { href: string, children: ReactNode, [key: string]: any }) => (
  <a href={href} onClick={(e) => { e.preventDefault(); window.location.href = href; }} {...props}>
    {children}
  </a>
);

// --- Define specific data types for clarity and type safety ---
interface Product { id: string; name: string; sku: string; }
interface Warehouse { id: string; name: string; code: string; }
interface StockItem { 
    id: string; // Required for the ListTable generic constraint T extends { id: string }
    productId: string; 
    warehouseId: string; 
    quantity: number; 
}


export default function Stock() {
  // State variables with explicit types
  const [stock, setStock] = useState<StockItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data setup
      const mockProducts: Product[] = [
        { id: 'p1', sku: 'SKU001', name: 'Coffee Beans' },
        { id: 'p2', sku: 'SKU002', name: 'Water Bottle' },
      ];
      const mockWarehouses: Warehouse[] = [
        { id: 'w1', name: 'Main Hub', code: 'MH' },
        { id: 'w2', name: 'West Dock', code: 'WD' },
      ];
      const mockStock: StockItem[] = [
        { id: 's1', productId: 'p1', warehouseId: 'w1', quantity: 500 },
        { id: 's2', productId: 'p1', warehouseId: 'w2', quantity: 150 },
        { id: 's3', productId: 'p2', warehouseId: 'w1', quantity: 300 },
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500)); 

      setStock(mockStock);
      setProducts(mockProducts);
      setWarehouses(mockWarehouses);
    } catch (error) {
      console.error("Error fetching data:", error);
      setStock([]);
      setProducts([]);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function with explicit string argument and return types
  const getProductName = (productId: string): string => {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.name} (${product.sku})` : "Unknown Product";
  };

  // Helper function with explicit string argument and return types
  const getWarehouseName = (warehouseId: string): string => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown Warehouse";
  };

  // Handler functions with explicit types
  const handleClickOpen = (id: string) => {
    setSelectedStockId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStockId(null);
  };

  const handleDelete = async () => {
    if (!selectedStockId) return;

    try {
      // Mock delete logic
      setStock(stock.filter((item) => item.id !== selectedStockId));
      handleClose();
      console.log(`Stock record ${selectedStockId} deleted.`);

    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  // Define the columns for the ListTable (The core declarative definition)
  const columns: DataTableColumn<StockItem>[] = [
    { 
      id: "productId", 
      label: "Product", 
      minWidth: 200,
      render: (row) => getProductName(row.productId) 
    },
    { 
      id: "warehouseId", 
      label: "Warehouse", 
      minWidth: 150,
      render: (row) => getWarehouseName(row.warehouseId) 
    },
    {
      id: "quantity",
      label: "Quantity",
      align: "right",
      // Safely access quantity and format it
      render: (row) => row.quantity?.toLocaleString() ?? 'N/A',
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      minWidth: 100,
      render: (row) => (
        <>
          <IconButton
            color="primary"
            component={CustomLink}
            href={`/stock/edit/${row.id}`}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleClickOpen(row.id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: "20px" }}>
          
          {/* NEW: Use the InventoryListHeader component */}
          <InventoryListHeader
            title="Stock Levels"
            actionButtonText="Add Stock Record"
            actionHref="/stock/add"
            CustomLinkComponent={CustomLink}
          />

          {/* ListTable no longer needs title or actionButton props */}
          <ListTable<StockItem> // Explicitly set the generic type for safety
            data={stock}
            columns={columns}
            loading={loading}
            emptyMessage="No stock records available. Add a new stock record to get started."
            // Table content needs padding/margin inside the Paper
            sx={{ p: { xs: 1, sm: 3 }, pt: 0 }} 
          />
        </Paper>
        
        {/* Delete Confirmation Dialog (kept local as it handles local state logic) */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Stock Record</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this stock record? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}